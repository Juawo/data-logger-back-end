from flask import Flask, request, jsonify
import os
from datetime import datetime

app = Flask(__name__)

# Caminho do cartão SD e arquivo de log
sd_card_path = '/media/sdcard'
log_file_name = 'datalog_sensores.txt'
full_log_path = os.path.join(sd_card_path, log_file_name)

@app.route('/dados', methods=['POST'])
def receber_dados():
    data = request.get_json()

    # Extrai os campos do JSON recebido
    sensor_id = data.get("id", "desconhecido")
    temperature = data.get("Temperature")
    umidade = data.get("Umidade")
    bpm = data.get("BPM")
    spo2 = data.get("SpO2")

    # Valida se veio temp e umidade
    if temperature is None or umidade is None:
        print("Recebida requisição com dados ausentes:", data)
        return jsonify({"erro": "Dados de temperatura ou umidade ausentes"}), 400

    # Timestamp no formato ISO
    timestamp = datetime.utcnow().isoformat()

    # Linha de log em formato CSV
    log_line = f"{timestamp},{sensor_id},{temperature},{umidade},{bpm},{spo2}\n"

    try:
        with open(full_log_path, "a") as log_file:
            log_file.write(log_line)
        print(f"Dados recebidos e salvos: {log_line.strip()}")
        return jsonify({"status": "Dados recebidos com sucesso!"}), 200
    except Exception as e:
        print("ERRO AO ESCREVER NO ARQUIVO DE LOG:", e)
        return jsonify({"erro": "Erro interno ao salvar os dados"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
