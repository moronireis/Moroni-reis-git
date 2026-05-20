import json
import random
import time
import smtplib
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_USER = "moronireis@gmail.com"
SMTP_PASS = "rwcy uklj szhd modt"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def generate_html_email(name):
    first_name = name.split()[0] if name else "aluno"

    greetings = [
        f"{first_name}, o Máquina de Vendas está sendo atualizado essa semana.",
        f"Fala, {first_name}! Atualizações novas chegando no Máquina de Vendas.",
        f"{first_name}, novidades importantes no Máquina de Vendas. Sem custo extra.",
        f"Opa {first_name}, o MDV tá recebendo atualizações essa semana. Confere.",
        f"E aí, {first_name}! O Máquina de Vendas tá sendo atualizado. Você precisa ver.",
        f"{first_name}, atualizações gratuitas no Máquina de Vendas. Abre o link.",
    ]

    body_options = [
        "Novos módulos de Prospecção, Vendas, Multiagentes e caminhos reais de lucro com IA. Tudo sem custo adicional pra quem já comprou. Confere os detalhes na página:",
        "Prospecção com IA, Multiagentes e os caminhos mais lucrativos — tudo sendo adicionado ao que você já tem. De graça. Veja tudo aqui:",
        "Módulos novos de Vendas com IA, Multiagentes e formas reais de gerar receita. Sem pagar nada a mais. Os detalhes estão aqui:",
        "Atualizações de Prospecção, Vendas, Multiagentes e lucro com IA chegando essa semana. Sem custo extra. Confere:",
    ]

    greeting = random.choice(greetings)
    body = random.choice(body_options)

    html = f'''<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #000000; color: #ffffff; margin: 0; padding: 0;">

  <div style="max-width: 640px; margin: 0 auto; padding: 40px 20px;">

    <div style="text-align: center; margin-bottom: 40px;">
      <span style="display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #4A90FF; background: rgba(74,144,255,0.08); border: 1px solid rgba(74,144,255,0.2); border-radius: 9999px; padding: 6px 16px;">MDV &mdash; Atualizações</span>
    </div>

    <div style="background: #0A0A0A; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 48px 36px;">

      <p style="font-size: 16px; line-height: 1.7; color: #ffffff; margin: 0 0 24px;">{greeting}</p>

      <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.85); margin: 0 0 32px;">{body}</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://reisia.moronireis.com.br/mdv-update" style="display: inline-block; background: #4A90FF; color: #ffffff; text-decoration: none; padding: 18px 52px; border-radius: 9999px; font-size: 16px; font-weight: 700; letter-spacing: -0.01em;">Ver atualizações</a>
      </div>

      <p style="font-size: 13px; color: rgba(255,255,255,0.35); text-align: center; margin: 0;">Assista o conteúdo, entre no grupo e receba tudo em primeira mão.</p>

    </div>

    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
      <p style="font-size: 14px; color: rgba(255,255,255,0.35); margin: 0 0 4px;">Moroni Reis</p>
      <p style="font-size: 12px; color: rgba(255,255,255,0.2); margin: 0;">Reis IA &middot; 2026</p>
    </div>

  </div>
</body>
</html>'''

    text = f"""{greeting}

{body}

https://reisia.moronireis.com.br/mdv-update

Assista o conteúdo, entre no grupo e receba tudo em primeira mão.

Moroni Reis
Reis IA"""

    return html, text


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "test"

    if mode == "test":
        name = "Moroni"
        to = "moronif.reis@gmail.com"
        html, text = generate_html_email(name)

        msg = MIMEMultipart("alternative")
        msg["From"] = "Moroni Reis <moronireis@gmail.com>"
        msg["To"] = to
        msg["Subject"] = "MDV - ATUALIZAÇÕES"
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        print(f"Enviando teste para {to}...")
        try:
            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            server.quit()
            print("Email enviado com sucesso!")
        except Exception as e:
            print(f"ERRO: {e}")

    elif mode == "disparo":
        start = int(sys.argv[2]) if len(sys.argv) > 2 else 0

        with open("/Users/moronireis/Projetos vscode/mdv-disparo-lista.json", "r") as f:
            contacts = json.load(f)

        batch = contacts[start:]
        print(f"Enviando emails para {len(batch)} leads MDV...\n")

        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)

        sent = 0
        for i, contact in enumerate(batch, start + 1):
            name = contact["name"]
            email = contact["email"]
            html, text = generate_html_email(name)

            msg = MIMEMultipart("alternative")
            msg["From"] = "Moroni Reis <moronireis@gmail.com>"
            msg["To"] = email
            msg["Subject"] = "MDV - ATUALIZAÇÕES"
            msg.attach(MIMEText(text, "plain"))
            msg.attach(MIMEText(html, "html"))

            print(f"[{i}/{len(contacts)}] {name} ({email})...")
            try:
                server.send_message(msg)
                print(f"  OK")
                sent += 1
            except Exception as e:
                print(f"  ERRO: {e}")

            if contact != batch[-1]:
                delay = random.uniform(3, 6)
                time.sleep(delay)

        server.quit()
        print(f"\nFinalizado! {sent}/{len(batch)} enviados.")


if __name__ == "__main__":
    main()
