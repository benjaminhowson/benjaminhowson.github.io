function pnorm(z) {
  return 0.5 * (1 + math.erf(z / math.sqrt(2)));
}

function qnorm(q) {
  const tol = 1e-5;

  let zmax = 20;
  let zmin = -20;

  let zmid = (zmin + zmax) / 2;
  let qmid = pnorm(zmid);

  while (math.abs(q - qmid) > tol) {
    if (qmid > q) {
      zmax = zmid;
    } else {
      zmin = zmid;
    }
    zmid = (zmax + zmin) / 2;
    qmid = pnorm(zmid);
  }

  return math.round(zmid, 3);
}

function zpower(delta, variance, zcritical, hypothesis) {

  const sign = {
    "!=": () => 1,
    ">": () => 1,
    "<": () => -1
  }; 

  const d = sign[hypothesis]() * delta/math.sqrt(variance);
  const lower = -d - math.abs(zcritical);
  const upper = zcritical - d;

  const power = {
    "!=": () => math.round(1 + pnorm(lower) - pnorm(upper), 3),
    ">": () => math.round(1 - pnorm(upper), 3),
    "<": () => math.round(pnorm(lower), 3)
  };

  return power[hypothesis]();
}


document.getElementById("calculate").onclick = function () {
  const hypothesis = document.getElementById('hypothesis').value
  const alpha = Number(document.getElementById("alpha").value)/100
  const delta = Number(document.getElementById("delta").value)

  const ncontrol = Number(document.getElementById("ncontrol").value)
  const nvariant = Number(document.getElementById("nvariant").value)
  const vcontrol = Number(document.getElementById("vcontrol").value)
  const vvariant = Number(document.getElementById("vvariant").value)
  const variance = vcontrol/ncontrol + vvariant/nvariant

  const qtable = {
    "!=": () => 1 - alpha/2,
    ">": () => 1 - alpha,
    "<": () => alpha
  };

  
  const q = qtable[hypothesis]();
  const zcritical = qnorm(q);
  const power = zpower(delta, variance, zcritical, hypothesis);

  document.getElementById("output-threshold").innerText = "Rejection Threshold: " + zcritical;
  document.getElementById("output-power").innerText = "Statistical Power: " + power;
};