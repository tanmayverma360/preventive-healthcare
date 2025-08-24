// src/ml/riskModel.js
import * as tf from "@tensorflow/tfjs";

export const IDX_TO_RISK = ["Low", "Medium", "High"];

export function vectorize(record) {
  const sleep = Math.max(0, Math.min(10, Number(record.sleep || 0))) / 10;
  const steps = Math.max(0, Math.min(12000, Number(record.steps || 0))) / 12000;
  const water = Math.max(0, Math.min(12, Number(record.water || 0))) / 12;
  const stress = Math.max(1, Math.min(5, Number(record.stress || 1))) / 5;
  const meals = String(record.meals || "balanced");
  const m_bal = meals === "balanced" ? 1 : 0;
  const m_sug = meals === "high-sugar" ? 1 : 0;
  const m_fat = meals === "high-fat" ? 1 : 0;
  const m_irr = meals === "irregular" ? 1 : 0;
  return [sleep, steps, water, stress, m_bal, m_sug, m_fat, m_irr];
}

function oneHot(i) {
  const a = [0, 0, 0];
  a[i] = 1;
  return a;
}

// Use your rule logic to "label" synthetic data (teacher-student)
function labelFromRules(rec) {
  let score = 0;
  if (rec.sleep < 6) score += 2;
  if (rec.steps < 4000) score += 2;
  if (rec.stress >= 3) score += 2;
  if (rec.water < 6) score += 1;
  if (rec.meals === "high-sugar" || rec.meals === "high-fat") score += 2;
  if (rec.meals === "irregular") score += 1;
  return score >= 6 ? 2 : score >= 3 ? 1 : 0; // 2=High,1=Medium,0=Low
}

function makeDataset(n = 600) {
  const xs = [],
    ys = [];
  for (let i = 0; i < n; i++) {
    const rec = {
      sleep: 4 + Math.random() * 6, // 4..10
      steps: Math.floor(Math.random() * 12000), // 0..12000
      water: Math.floor(Math.random() * 12), // 0..12
      stress: 1 + Math.floor(Math.random() * 5), // 1..5
      meals: ["balanced", "high-sugar", "high-fat", "irregular"][
        Math.floor(Math.random() * 4)
      ],
    };
    xs.push(vectorize(rec));
    ys.push(oneHot(labelFromRules(rec)));
  }
  return {
    xs: tf.tensor2d(xs),
    ys: tf.tensor2d(ys),
  };
}

export async function loadOrTrainModel({ epochs = 25, batchSize = 32 } = {}) {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [8], units: 16, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 12, activation: "relu" }));
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const { xs, ys } = makeDataset(600);
  await model.fit(xs, ys, { epochs, batchSize, verbose: 0 });
  xs.dispose();
  ys.dispose();

  return model;
}

export function predictWithModel(model, record) {
  const t = tf.tensor2d([vectorize(record)]);
  const probs = model.predict(t).arraySync()[0];
  t.dispose();
  let maxI = 0,
    maxV = -Infinity;
  for (let i = 0; i < probs.length; i++)
    if (probs[i] > maxV) {
      maxV = probs[i];
      maxI = i;
    }
  return IDX_TO_RISK[maxI];
}
