// MaxxkiPseudonicer.node.ts
import { IExecuteFunctions } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { spawn } from 'child_process';
import * as path from 'path';

// Helper function außerhalb der Klasse
async function runPythonScript(scriptPath: string, inputData: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python-Prozess beendet mit Code ${code}: ${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
    
    pythonProcess.on('error', (err) => {
      reject(err);
    });
    
    // Input an stdin senden
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
  });
}

export class MaxxkiPseudonicer implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MAXXKI PII Pseudonicer',
    name: 'maxxkiPseudonicer',
    group: ['transform'],
    version: 1,
    description: 'Pseudonymisiert PII (Emails, IBANs, Telefon, Namen) – komplett offline',
    defaults: {
      name: 'PII Pseudonicer',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Text zu pseudonymisieren',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        typeOptions: {
          rows: 5,
        },
        description: 'Der Text, der PII enthalten kann',
      },
      {
        displayName: 'Text aus vorherigem Node übernehmen',
        name: 'useInputData',
        type: 'boolean',
        default: true,
        description: 'Wenn aktiv, wird der Input vom vorherigen Node verwendet',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const useInputData = this.getNodeParameter('useInputData', 0) as boolean;
    
    // Pfad zum Python-Skript (relativ zu dieser Node-Datei)
    const scriptPath = path.join(__dirname, 'maxxki_pseudonicer.py');

    for (let i = 0; i < items.length; i++) {
      let text: string;

      if (useInputData) {
        // JSON-Input in String konvertieren für Python-Skript
        text = JSON.stringify(items[i].json);
      } else {
        text = this.getNodeParameter('text', i) as string;
      }

      // Python-Skript mit stdin aufrufen - jetzt als Funktion, nicht als Klassenmethode
      const { stdout, stderr } = await runPythonScript(scriptPath, text);

      if (stderr && !stderr.includes('Warning')) {
        throw new Error(`Python-Fehler: ${stderr}`);
      }

      // Versuche, stdout als JSON zu parsen (falls das Skript JSON zurückgibt)
      let result: any;
      try {
        result = JSON.parse(stdout);
      } catch {
        result = { pseudonymized: stdout.trim() };
      }

      returnData.push({ json: result });
    }

    return [returnData];
  }
}
