// src/ml/useRiskModel.js
import { useEffect, useState } from "react";
import { loadOrTrainModel, predictWithModel } from "./riskModel";
import * as tf from "@tensorflow/tfjs";

export function useRiskModel() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const [model, setModel] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setStatus("training");
      const m = await loadOrTrainModel();
      if (!alive) return;
      setModel(m);
      setReady(true);
      setStatus("ready");
    })();
    return () => {
      alive = false;
    };
  }, []);

  const predictRisk = (record) => {
    if (!model || !record) return null;
    return predictWithModel(model, record);
  };

  return { ready, status, predictRisk };
}
