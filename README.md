# Codifica.

Um site educativo para codificar e decodificar mensagens, acompanhando visualmente cada etapa do processo.

## Como funciona

1. A mensagem é convertida em bytes UTF-8.
2. Cada byte é combinado com os bytes da chave usando XOR. A chave é repetida quando necessário.
3. O resultado é transformado em Base64 para gerar um código copiável.
4. Para recuperar a mensagem, o processo é revertido com a mesma chave: Base64 → XOR → texto UTF-8.

A aplicação é totalmente client-side: nenhuma mensagem ou chave é enviada para um servidor.

> **Atenção:** XOR com chave repetida é adequado para demonstração e aprendizado, mas não substitui criptografia profissional. Não use esta ferramenta para proteger dados sensíveis.

## Executar

Abra `index.html` em um navegador moderno. Não há dependências ou etapa de build.
