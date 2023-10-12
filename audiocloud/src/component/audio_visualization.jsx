import React, { useEffect, useRef } from "react";
import WAAClock from "web-audio-api";

const AudioVisualization = ({ audioUrl }) => {
  const audioContext = new WAAClock();

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";

    const audioSource = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    audio.addEventListener("canplay", () => {
      audioSource.start(0);
    });

    const draw = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "purple";

      const barWidth = (canvas.width / bufferLength) * 2;

      let x = 0;
      dataArray.forEach((value) => {
        const barHeight = (value / 255) * canvas.height;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [audioUrl, canvasRef, audioContext]);

  return <canvas ref={canvasRef}></canvas>;
};

export default AudioVisualization;