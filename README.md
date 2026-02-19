# Lembre!

App de lembretes recorrentes para Android e iOS. Escolha um intervalo de tempo, selecione o tipo de alerta e ative — você receberá notificações repetidas no intervalo definido.

## Funcionalidades

- **Intervalo configurável** — de 1h a 12h30, em incrementos de 30 minutos
- **3 tipos de alerta** — silencioso, vibração ou som (com alarme customizado)
- **Countdown em tempo real** — exibe hora de início, próximo alarme e contagem regressiva
- **Persistência** — configuração salva automaticamente via AsyncStorage
- **Feedback háptico** — em todas as interações

## Tech Stack

- [Expo](https://expo.dev) SDK 54 (New Architecture habilitada)
- React Native 0.81
- Expo Router (file-based routing)
- expo-notifications (notificações recorrentes com `TIME_INTERVAL`)
- AsyncStorage (persistência local)
- TypeScript (strict mode)

## Começando

### Pré-requisitos

- Node.js
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go (para teste rápido) ou dev client (para notificações reais)

> **Nota:** expo-notifications foi removido do Expo Go no SDK 53+. O app funciona no Expo Go (com stubs), mas notificações reais requerem um dev client ou build nativo.

### Instalação

```bash
npm install
```

### Executando

```bash
npx expo start            # Dev server (QR code para Expo Go)
npx expo start --android  # Abre direto no Android
npx expo start --ios      # Abre direto no iOS
```

## Estrutura do Projeto

```
app/
  _layout.tsx              # Layout raiz (setup do notification handler)
  index.tsx                # Tela principal (única tela do app)
src/
  types/alarm.ts           # AlertType e AlarmConfig
  constants/alarm.ts       # Opções dos pickers e config padrão
  services/
    storage.ts             # Persistência via AsyncStorage
    notifications.ts       # Agendamento de notificações e permissões
  hooks/
    useAlarmConfig.ts      # Estado central do alarme
    useCountdown.ts        # Countdown em tempo real
  components/
    HourPicker.tsx         # Seletor horizontal de horas (1-12)
    MinutePicker.tsx        # Seletor de minutos (0 ou 30)
    AlertTypeSelector.tsx  # Seletor do tipo de alerta
    ActiveAlarmInfo.tsx    # Info do alarme ativo (countdown)
assets/
  alarm.wav                # Som customizado de alarme
```

## Permissões Android

- `RECEIVE_BOOT_COMPLETED` — manter alarmes após reinício
- `VIBRATE` — feedback de vibração
- `SCHEDULE_EXACT_ALARM` — agendamento preciso de notificações
