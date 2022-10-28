export function createDocumentSign(
  cropData: string,
  activityData?: string,
  achievementData?: string,
  evidences?: string,
  signers?: string
) {
  return `<!DOCTYPE html>
    <html>
    <head>
        <title>Bitacora</title>
        <style type="text/css">
            body {
                margin-right: 250px;
                margin-left: 250px;
            }

            p {
                font-size: 10px;
            }
            .image-evidence {
                display: flex;
                justify-content: center; 
                align-items: center; 
                margin-top: 50px;
                margin-bottom: 50px;
                height: 200px;
                width: 200px;
            }
        </style>
    </head>
    <body>
        <div>
            <h4>Cultivo</h4>
            <hr>
            ${cropData}
        </div>
        <div>
            <h4>Actividad</h4>
            <hr>
            ${activityData}
        </div>
        <div>
            <h4>Realizaciones</h4>
            <hr>
            ${achievementData}
        </div>
        <div>
            <h4>Evidencias</h4>
            ${evidences}
        </div>
        <hr>
        <p>Las siguientes personas expresaron su acuerdo a las declaraciones expresadas en este documento:</p>
        ${signers}
    </body>
    </html>`
}
