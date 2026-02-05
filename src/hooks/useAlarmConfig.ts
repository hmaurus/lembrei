import { useState, useEffect, useCallback, useRef } from 'react';
import { AlarmConfig, AlertType } from '../types/alarm';
import { DEFAULT_CONFIG } from '../constants/alarm';
import { saveAlarmConfig, loadAlarmConfig } from '../services/storage';
import {
  scheduleRecurringNotification,
  cancelAllNotifications,
  requestPermissions,
} from '../services/notifications';

export function useAlarmConfig() {
  const [config, setConfig] = useState<AlarmConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Load saved config on mount
  useEffect(() => {
    loadAlarmConfig()
      .then(setConfig)
      .finally(() => {
        setIsLoading(false);
        isInitialLoad.current = false;
      });
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

  const toggleAlarm = useCallback(async () => {
    if (config.isActive) {
      await cancelAllNotifications();
      setConfig((prev) => ({
        ...prev,
        isActive: false,
        notificationId: undefined,
        startTimestamp: undefined,
      }));
    } else {
      const granted = await requestPermissions();
      if (!granted) return;

      const notificationId = await scheduleRecurringNotification(
        config.hours,
        config.minutes,
        config.alertType,
      );
      setConfig((prev) => ({
        ...prev,
        isActive: true,
        notificationId,
        startTimestamp: Date.now(),
      }));
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
