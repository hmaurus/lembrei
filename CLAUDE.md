# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

- Código em inglês (vars, funcs, classes, entidades); Comunicação com o usuário e documentação em pt-BR (commits, gitgub issues, mensagens de erro, comentários etc)

## Visão Geral

Lembrei! é um app de lembretes/alarmes recorrentes feito com Expo (SDK 54) e React Native. O usuário escolhe um intervalo (horas + minutos) e um tipo de alerta (silencioso, vibração, som), e então ativa/desativa o alarme. As notificações se repetem no intervalo escolhido.

## Comandos

```bash
npx expo start            # Inicia o dev server (Expo Go ou dev client)
npx expo start --android  # Inicia no Android
npx expo start --ios      # Inicia no iOS
```

Nenhum framework de testes, linter ou formatter está configurado no momento.

## Arquitetura

**Roteamento:** Expo Router (file-based). `app/_layout.tsx` é o layout raiz; `app/index.tsx` é a única tela.

**Código-fonte (`src/`):**
- `types/alarm.ts` — union `AlertType` (`'silencioso' | 'vibração' | 'som'`) e interface `AlarmConfig`
- `constants/alarm.ts` — opções dos pickers, chave do storage, config padrão, `calculateIntervalSeconds()`
- `services/storage.ts` — persistência via AsyncStorage (salva/carrega `AlarmConfig`)
- `services/notifications.ts` — agendamento de expo-notifications, permissões, setup do canal Android
- `hooks/useAlarmConfig.ts` — hook central de estado: carrega config persistida, salva automaticamente ao mudar, gerencia toggle (agenda/cancela notificações)
- `hooks/useCountdown.ts` — calcula próximo alarme e countdown com `setInterval` de 1s; recebe `startTimestamp` e `intervalSeconds`
- `components/` — `HourPicker`, `MinutePicker`, `AlertTypeSelector` (pickers horizontais com haptics), `ActiveAlarmInfo` (exibe hora de início, próximo alarme e countdown)

**Fluxo de dados:** `useAlarmConfig` carrega do AsyncStorage na montagem → estado alimenta a UI → mudanças do usuário são auto-persistidas → toggle agenda/cancela expo-notifications. Ao ativar, `startTimestamp` é gravado e `useCountdown` calcula o countdown em tempo real.

## Padrões Importantes

- **Import condicional de expo-notifications:** `notifications.ts` detecta Expo Go via `Constants.appOwnership` e pula o carregamento de `expo-notifications` (foi removido do Expo Go no SDK 53). As funções retornam stubs/no-ops no Expo Go.
- **Sem estilos inline:** todos os componentes usam `StyleSheet.create`.
- **Feedback háptico:** todos os elementos interativos disparam haptics via `expo-haptics`.
- **Canal de notificação Android:** recriado a cada ativação do alarme com configurações correspondentes ao tipo de alerta selecionado.
- **Som de alarme customizado:** `assets/alarm.wav` é empacotado via plugin `expo-notifications` no `app.json`.
- **New Architecture habilitada:** `newArchEnabled: true` no `app.json`. Considerar compatibilidade ao adicionar bibliotecas nativas.
