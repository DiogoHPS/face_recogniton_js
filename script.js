const video = document.getElementById("video");

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function fetchLabels() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Erro ao buscar labels');
    const labels = await response.json();
    console.log("Labels carregados:", labels);
    return labels;
  } catch (error) {
    console.error("Erro ao buscar labels:", error);
    return [];
  }
}

async function getLabeledFaceDescriptions() {
  const labels = await fetchLabels(); // Busca as labels via API
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        try {
          const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        } catch (error) {
          console.warn(`Erro ao processar imagem ${i} de ${label}:`, error);
        }
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString(),
      });
      drawBox.draw(canvas);

      // Quando o rosto é reconhecido
      if (result.label !== "unknown") {
        showNotification(result.label);
      }
    });
  }, 100);
});

function showNotification(label) {
  // Exibir mensagem e imagem no HTML
  const notificationDiv = document.getElementById("notification");
  notificationDiv.innerHTML = `
    <p>Bem-vindo, ${label}!</p>
    <img src="./labels/${label}/1.png" alt="Imagem do usuário ${label}" style="width: 150px; border-radius: 10px;">
  `;

  // Fazer a notificação desaparecer após 5 segundos (opcional)
  setTimeout(() => {
    notificationDiv.innerHTML = ""; // Limpa a notificação
  }, 5000);
}
