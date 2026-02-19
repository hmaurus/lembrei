/**
 * Hook central de estado do alarme: carrega config persistida, salva mudanças,
 * gerencia toggle (agenda/cancela notificações), e verifica consistência ao iniciar.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import { AlarmConfig, AlertType } from '../types/alarm';
import { DEFAULT_CONFIG } from '../constants/alarm';
import { saveAlarmConfig, loadAlarmConfig } from '../services/storage';
import {
  scheduleRecurringNotification,
  cancelAllNotifications,
  requestPermissions,
  hasScheduledNotifications,
} from '../services/notifications';

/** Resultado do toggleAlarm para a UI tratar feedback. */
export type ToggleResult = 'activated' | 'deactivated' | 'permission_denied';

// Habilita LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function useAlarmConfig() {
  const [config, setConfig] = useState<AlarmConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Load saved config on mount and verify scheduled notifications
  useEffect(() => {
    const init = async () => {
      const saved = await loadAlarmConfig();

      // Se o alarme está marcado como ativo, verifica se a notificação
      // ainda existe (o OS pode ter cancelado em background)
      if (saved.isActive) {
        const hasNotif = await hasScheduledNotifications();
        if (!hasNotif) {
          // Reagenda a notificação perdida para manter consistência
          try {
            const notificationId = await scheduleRecurringNotification(
              saved.hours,
              saved.minutes,
              saved.alertType,
            );
            saved.notificationId = notificationId;
          } catch {
            // Se falhar ao reagendar, desativa o alarme
            saved.isActive = false;
            saved.notificationId = undefined;
            saved.startTimestamp = undefined;
          }
        }
      }

      setConfig(saved);
      setIsLoading(false);
      isInitialLoad.current = false;
    };

    init();
  }, []);

  // Persist config changes (skip initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;
    saveAlarmConfig(config);
  }, [config]);

  const setHours = useCallback((hours: number) => {
    setConfig((prev) => ({ ...prev, hours }));
  }, []);

  const setMinutes = useCallback((minutes: number) => {
    setConfig((prev) => ({ ...prev, minutes }));
  }, []);

  const setAlertType = useCallback((alertType: AlertType) => {
    setConfig((prev) => ({ ...prev, alertType }));
  }, []);

  const isToggling = useRef(false);

  const toggleAlarm = useCallback(async (): Promise<ToggleResult> => {
    if (isToggling.current) return config.isActive ? 'activated' : 'deactivated';
    isToggling.current = true;

    try {
      if (config.isActive) {
        await cancelAllNotifications();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setConfig((prev) => ({
          ...prev,
          isActive: false,
          notificationId: undefined,
          startTimestamp: undefined,
        }));
        return 'deactivated';
      } else {
        const granted = await requestPermissions();
        if (!granted) return 'permission_denied';

        const notificationId = await scheduleRecurringNotification(
          config.hours,
          config.minutes,
          config.alertType,
        );
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setConfig((prev) => ({
          ...prev,
          isActive: true,
          notificationId,
          startTimestamp: Date.now(),
        }));
        return 'activated';
      }
    } finally {
      isToggling.current = false;
    }
  }, [config.isActive, config.hours, config.minutes, config.alertType]);

  return {
    config,
    isLoading,
    setHours,
    setMinutes,
    setAlertType,
    toggleAlarm,
  };
}
