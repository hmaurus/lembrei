# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

- Código em inglês (vars, funcs, classes, entidades); Comunicação com o usuário e documentação em pt-BR (commits, gitgub issues, mensagens de erro, comentários etc)

## Visão Geral

- Lembre! é um app de lembretes/alarmes recorrentes feito com Expo (SDK 54) e React Native. O usuário escolhe um intervalo (horas + minutos) e um tipo de alerta (silencioso, vibração, som), e então ativa/desativa o alarme. As notificações se repetem no intervalo escolhido.

- O principal diferencial do app é a simplicidade e foco em um único propósito.

## Comandos

```bash
npx expo start            # Inicia o dev server (Expo Go ou dev client)
npx expo start --android  # Inicia no Android
npx expo start --ios      # Inicia no iOS
npx jest                  # Roda toda a suíte de testes
npx tsc --noEmit          # Verificação de tipos
```

## Testes

- **Framework:** Jest + jest-expo (preset) + @testing-library/react-native
- **Estrutura:** Testes em `src/__tests__/` com sufixo `.test.ts` ou `.test.tsx`
- **Mocks globais:** `jest.setup.js` (expo-haptics, expo-constants, expo-device, AsyncStorage)
- **Padrão:** Toda lógica nova (constantes, services, hooks) deve ter testes unitários. Componentes devem testar renderização, interação e acessibilidade.
- **Rodar antes de commitar:** `npx jest && npx tsc --noEmit`

Nenhum linter ou formatter está configurado no momento.

## Arquitetura

**Roteamento:** Expo Router (file-based). `app/_layout.tsx` é o layout raiz; `app/index.tsx` é a única tela.

**Código-fonte (`src/`):**
- `types/alarm.ts` — union `AlertType` (`'silencioso' | 'vibração' | 'som'`) e interface `AlarmConfig`
- `constants/alarm.ts` — opções dos pickers, chave do storage, config padrão, `calculateIntervalSeconds()`
- `services/storage.ts` — persistência via AsyncStorage (salva/carrega `AlarmConfig`)
- `services/notifications.ts` — agendamento de expo-notifications, permissões, setup do canal Android
- `hooks/useAlarmConfig.ts` — hook central de estado: carrega config persistida (com validação), salva automaticamente, gerencia toggle com LayoutAnimation e proteção contra duplo-toque, verifica notificações agendadas ao restaurar
- `hooks/useCountdown.ts` — calcula próximo alarme e countdown com `setInterval` de 1s; recebe `startTimestamp` e `intervalSeconds`
- `components/` — `HourPicker` (grid 2×6 com haptics), `MinutePicker` (00/15/30/45), `AlertTypeSelector` (silencioso/vibração/som), `ActiveAlarmInfo` (countdown com animação de entrada e suporte a reduceMotion)

**Fluxo de dados:** `useAlarmConfig` carrega do AsyncStorage na montagem → estado alimenta a UI → mudanças do usuário são auto-persistidas → toggle agenda/cancela expo-notifications. Ao ativar, `startTimestamp` é gravado e `useCountdown` calcula o countdown em tempo real.

## Padrões Importantes

- **Import condicional de expo-notifications:** `notifications.ts` detecta Expo Go via `Constants.appOwnership` e pula o carregamento de `expo-notifications` (foi removido do Expo Go no SDK 53). As funções retornam stubs/no-ops no Expo Go.
- **Sem estilos inline:** todos os componentes usam `StyleSheet.create`.
- **Feedback háptico:** todos os elementos interativos disparam haptics via `expo-haptics`.
- **Canal de notificação Android:** recriado a cada ativação do alarme com configurações correspondentes ao tipo de alerta selecionado.
- **Som de alarme customizado:** `assets/alarm.wav` é empacotado via plugin `expo-notifications` no `app.json`.
- **New Architecture habilitada:** `newArchEnabled: true` no `app.json`. Considerar compatibilidade ao adicionar bibliotecas nativas.
- **Acessibilidade:** Todos os elementos interativos têm `accessibilityRole`, `accessibilityLabel` e `accessibilityState`. Pickers usam `radiogroup`/`radio`. Textos críticos têm `maxFontSizeMultiplier`.
- **Validação de dados persistidos:** `loadAlarmConfig` valida contra `HOUR_OPTIONS`, `MINUTE_OPTIONS` e tipos válidos, retornando `DEFAULT_CONFIG` se corrompido.
- **LayoutAnimation:** Transições de estado (ativar/desativar alarme) são animadas via `LayoutAnimation.configureNext`. Android requer `UIManager.setLayoutAnimationEnabledExperimental(true)`.
- **Design tokens centralizados:** `src/constants/theme.ts` exporta `colors`, `fonts`, `spacing`, `radii`. Usar `colors.textOnAccent` para texto sobre fundo accent (contraste AA).
