# Lembre! — Prompts para geração de assets visuais

## Identidade visual de referência

- **Logo:** sino/bell âmbar/laranja (#FF9F0A) com badge circular cinza com número "1"
- **Tema:** "Amber Glow" — fundo escuro (#111111) com acentos em âmbar
- **Estilo:** flat design, minimalista, cantos arredondados
- **Cores:** âmbar (#FF9F0A), fundo quase preto (#111111), texto claro (#F5F5F7)

---

## 1. Ícone do app (512x512)

> Já existe como `assets/logo-lembre.png`. Usar diretamente como base para o ícone da Play Store (512x512).

Se quiser regenerar com melhor resolução:

```
Um ícone de app mobile minimalista em estilo flat design: um sino (bell) na cor âmbar dourado (#FF9F0A) centralizado sobre fundo escuro (#111111). O sino tem bordas arredondadas e suaves, com um pequeno círculo cinza (#8E8E93) no canto superior direito contendo o número "1" em branco. Estilo clean, sem texturas, sem gradientes, sem sombras. Formato quadrado com cantos arredondados. Alta resolução, 512x512 pixels.
```

## 2. Ícone adaptativo — foreground (1024x1024, com safe zone)

```
Um sino (bell) na cor âmbar dourado (#FF9F0A) centralizado em fundo transparente. O sino ocupa cerca de 66% da área central (respeitando a safe zone de ícones adaptativos Android). Pequeno badge circular cinza (#8E8E93) no canto superior direito do sino com o número "1" em branco. Estilo flat design minimalista, sem texturas, sem gradientes, sem sombras. Fundo transparente. 1024x1024 pixels.
```

**Nota:** O background do ícone adaptativo será cor sólida #111111 (configurado no app.json).

## 3. Ícone monocromático (para themed icons Android 13+)

```
Silhueta de um sino (bell) em branco puro sobre fundo transparente. Forma simples e limpa, sem detalhes internos — apenas o contorno preenchido. Pequeno círculo no canto superior direito do sino com o número "1". Tudo em uma única cor branca (#FFFFFF). Fundo totalmente transparente. Estilo ícone monocromático Android. 1024x1024 pixels.
```

---

## 4. Feature Graphic (1024x500) — OBRIGATÓRIO Play Store

```
Banner horizontal minimalista para a Google Play Store (1024x500px). Fundo escuro gradiente sutil de #111111 para #1C1C1E. No lado esquerdo, o ícone do app: um sino âmbar dourado (#FF9F0A) com badge cinza "1". No lado direito, o texto "Lembre!" em branco bold (#F5F5F7) com o subtexto "Lembretes simples que funcionam" em cinza claro (#A1A1A6) abaixo. Estilo clean e moderno, sem elementos decorativos excessivos. Pequenos acentos âmbar sutis como detalhes (círculos ou linhas finas).
```

## 5. Screenshots (1080x1920 ou 1284x2778) — MÍNIMO 2, RECOMENDADO 4

### Screenshot 1 — Tela principal (alarme desativado)

```
Mockup de screenshot de celular Android mostrando um app de lembretes. Fundo escuro (#111111). No topo: logo de sino âmbar pequeno + texto "Lembre!" em branco bold, com pill/badge âmbar abaixo dizendo "a cada 1h 30min". Abaixo, grid de horas (1-12) em cards escuros com "3" selecionado em âmbar. Abaixo, opções de minutos (00, 15, 30, 45) com "30" selecionado em âmbar. Abaixo, seletor de tipo de alerta com opções (Padrão, Visual, Vibração, Som). Na parte inferior, texto "Alarme desativado" centralizado e botão grande âmbar "Ativar". Estilo UI real, sem moldura de celular ao redor. 1080x1920 pixels.
```

### Screenshot 2 — Alarme ativo (com countdown)

```
Mockup de screenshot de celular Android mostrando um app de lembretes com alarme ativo. Fundo escuro (#111111). No topo: logo de sino âmbar + "Lembre!" em branco. Grid de horas com "3" selecionado (todos desabilitados/opacidade reduzida). Na parte inferior, card com borda âmbar e fundo semitransparente âmbar mostrando: "Próximo alarme: 14:30" e countdown "00:45:12" em fonte monoespaçada grande. Abaixo do countdown, botão vermelho (#FF453A) "Desativar". 1080x1920 pixels.
```

### Screenshot 3 — Casos de uso

```
Imagem promocional com fundo escuro (#111111). Título "Ideal para:" em branco bold no topo. Lista visual com ícones simples âmbar e texto branco: "💧 Beber água", "💊 Tomar remédio", "⏸️ Fazer pausas", "🏃 Alongamentos", "✅ Verificar tarefas". Na parte inferior, texto menor em cinza: "Configure em 5 segundos. Sem cadastro. Sem anúncios." Estilo clean e minimalista. 1080x1920 pixels.
```

### Screenshot 4 — Privacidade e simplicidade

```
Imagem promocional com fundo escuro (#111111). Ícone de sino âmbar centralizado no topo (tamanho médio). Abaixo, três badges/pills com ícones: "🔒 100% offline", "🚫 Sem anúncios", "⚡ Leve e rápido". Na parte inferior, texto "Seus dados ficam no seu dispositivo." em cinza claro (#A1A1A6). Estilo minimalista e confiável. 1080x1920 pixels.
```

---

## Notas

- Todas as imagens devem ser PNG
- Feature graphic: exatamente 1024x500px (obrigatório Play Store)
- Screenshots: recomendado 1080x1920px (16:9) ou 1284x2778px (iPhone-style)
- Ícone Play Store: 512x512px (gerado automaticamente pelo EAS a partir do icon.png se for 1024x1024)
- A Google Play comprime para JPEG/WebP, então evite texto muito pequeno
