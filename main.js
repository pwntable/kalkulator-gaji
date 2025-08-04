// ====== BUTTON BEHAVIOUR ======
let lastInput = {
    gajiBasic: "", ot15: "", ot2: "", ot3: "", nightRate: "", nightDay: ""
};
const otYes = document.getElementById("ot-yes");
const otNo = document.getElementById("ot-no");
const otSection = document.getElementById("ot-section");
otNo.classList.add("active");
otSection.style.display = "none";
otYes.onclick = function(){ otSection.style.display="block"; otYes.classList.add("active"); otNo.classList.remove("active");};
otNo.onclick = function(){ otSection.style.display="none"; otNo.classList.add("active"); otYes.classList.remove("active");
  document.getElementById('ot15').value = "";
  document.getElementById('ot2').value = "";
  document.getElementById('ot3').value = "";
};
const nightYes = document.getElementById("night-yes");
const nightNo = document.getElementById("night-no");
const nightSection = document.getElementById("nightshift-section");
nightNo.classList.add("active");
nightSection.style.display = "none";
nightYes.onclick = function(){ nightSection.style.display="block"; nightYes.classList.add("active"); nightNo.classList.remove("active");};
nightNo.onclick = function(){ nightSection.style.display="none"; nightNo.classList.add("active"); nightYes.classList.remove("active");
  document.getElementById('nightRate').value = "";
  document.getElementById('nightDay').value = "";
  document.getElementById('nightRateError').textContent = '';
  document.getElementById('nightDayError').textContent = '';
};

function semakGajiBasic() {
  let basicInput = document.getElementById('gajiBasic');
  let errorMsg = document.getElementById('basicError');
  let val = parseFloat(basicInput.value);
  if (basicInput.value === "") { errorMsg.textContent = "Sila masukkan gaji asas anda."; basicInput.value = ""; return false; }
  if (isNaN(val) || val < 1) { errorMsg.textContent = "Gaji asas mesti sekurang-kurangnya RM1."; basicInput.value = ""; return false; }
  else { errorMsg.textContent = ""; return true; }
}
function validateNightShift() {
  if (nightSection.style.display === "none") return true;
  const rate = document.getElementById('nightRate').value.trim();
  const day = document.getElementById('nightDay').value.trim();
  let isValid = true;
  let rateError = "", dayError = "";
  if (rate && !day) { dayError = "Wajib isi Bilangan Hari"; isValid = false; }
  if (day && !rate) { rateError = "Wajib isi Kadar satu malam"; isValid = false; }
  document.getElementById('nightRateError').textContent = rateError;
  document.getElementById('nightDayError').textContent = dayError;
  return isValid;
}
document.getElementById('formGaji').addEventListener('submit', function(e){
    e.preventDefault();
    if(!semakGajiBasic()){ document.getElementById('gajiBasic').focus(); return false; }
    if(!validateNightShift()){
      if(!document.getElementById('nightRate').value) document.getElementById('nightRate').focus();
      else document.getElementById('nightDay').focus();
      return false;
    }
    let ot15 = otSection.style.display !== "none" ? parseFloat(document.getElementById('ot15').value || 0) : 0;
    let ot2  = otSection.style.display !== "none" ? parseFloat(document.getElementById('ot2').value || 0) : 0;
    let ot3  = otSection.style.display !== "none" ? parseFloat(document.getElementById('ot3').value || 0) : 0;

    lastInput.gajiBasic = document.getElementById('gajiBasic').value;
    lastInput.ot15 = document.getElementById('ot15').value;
    lastInput.ot2  = document.getElementById('ot2').value;
    lastInput.ot3  = document.getElementById('ot3').value;
    lastInput.nightRate = document.getElementById('nightRate').value;
    lastInput.nightDay = document.getElementById('nightDay').value;

    let gajiBasic = parseFloat(lastInput.gajiBasic || 0);

    let nightRate = nightSection.style.display !== "none" ? parseFloat(document.getElementById('nightRate').value || 0) : 0;
    let nightDay  = nightSection.style.display !== "none" ? parseFloat(document.getElementById('nightDay').value || 0) : 0;

    let gajiHari = gajiBasic / 26;
    let gajiJam = gajiHari / 8;
    let otAmt1 = gajiJam * 1.5 * ot15;
    let otAmt2 = gajiJam * 2.0 * ot2;
    let otAmt3 = gajiJam * 3.0 * ot3;
    let jumlahOT = otAmt1 + otAmt2 + otAmt3;

    let nightTotal = (nightRate && nightDay) ? (nightRate * nightDay) : 0;
    let gajiKasar = gajiBasic + jumlahOT + nightTotal;
    let carumanBase = gajiBasic;
    let epfPekerja = carumanBase * 0.11;
    let epfMajikan = carumanBase * 0.13;
    let socsoPekerja = carumanBase * 0.005;
    let sipPekerja = carumanBase * 0.002;
    let sipMajikan = carumanBase * 0.002;
    let gajiBersih = gajiKasar - (epfPekerja + socsoPekerja + sipPekerja);

    window.gajiBersihToTransfer = gajiBersih;

    document.getElementById('form-view').style.display = 'none';
    document.getElementById('result-view').innerHTML = `
      <div class="output">
        <div class="output-title">Gaji Kasar <span style="float:right">RM${gajiKasar.toFixed(2)}</span></div>
        <hr>
        <div class="rowx bold" style="margin-bottom:2px;">Pecahan Jumlah Caruman*</div>
        <div class="rowx"><span>KWSP / EPF (Pekerja)</span> <span>RM${epfPekerja.toFixed(2)}</span></div>
        <div class="rowx"><span>KWSP / EPF (Majikan)</span> <span>RM${epfMajikan.toFixed(2)}</span></div>
        <div class="rowx bold"><span>Jumlah KWSP / EPF</span> <span>RM${(epfPekerja+epfMajikan).toFixed(2)}</span></div>
        <div class="rowx" style="margin-top:12px;"><span>PERKESO / SOCSO (Pekerja)</span> <span>RM${socsoPekerja.toFixed(2)}</span></div>
        <div class="rowx bold"><span>Jumlah PERKESO / SOCSO</span> <span>RM${socsoPekerja.toFixed(2)}</span></div>
        <div class="rowx" style="margin-top:12px;"><span>SIP / EIS (Pekerja)</span> <span>RM${sipPekerja.toFixed(2)}</span></div>
        <div class="rowx"><span>SIP / EIS (Majikan)</span> <span>RM${sipMajikan.toFixed(2)}</span></div>
        <div class="rowx bold"><span>Jumlah SIP / EIS</span> <span>RM${(sipPekerja+sipMajikan).toFixed(2)}</span></div>
        ${nightTotal > 0 ? `<div class="rowx" style="margin-top:12px;">
            <span><b>Elaun Night Shift (${nightDay} hari)</b></span>
            <span><b>RM${nightTotal.toFixed(2)}</b></span>
        </div>` : ""}
        <hr>
        <div class="rowx bold">Perincian OT</div>
        <div class="perincian-ot">
          <div class="rowx"><span>OT 1.5x</span> <span>${ot15} jam = RM${otAmt1.toFixed(2)}</span></div>
          <div class="rowx"><span>OT 2.0x</span> <span>${ot2} jam = RM${otAmt2.toFixed(2)}</span></div>
          <div class="rowx"><span>OT 3.0x</span> <span>${ot3} jam = RM${otAmt3.toFixed(2)}</span></div>
        </div>
        <div class="rowx summary"><span>Jumlah Nilai Gaji OT</span> <span>RM${jumlahOT.toFixed(2)}</span></div>
        <div class="rowx summary" style="color:#175e36; margin-top:22px;"><span><b>Gaji Bersih</b></span> <span><b>RM${gajiBersih.toFixed(2)}</b></span></div>
        <hr>
        <button onclick="doPrint()" type="button" class="btn-green" style="width:100%;">Cetak</button>
        <button onclick="goToBajet()" type="button" class="btn-green" style="width:100%;background:#098f66;margin-top:10px;font-size:1.07em;">Terus ke Kalkulator Bajet</button>
        <button onclick="showFormAgain()" type="button" class="btn-back">Kembali ke Borang</button>
      </div>
    `;
    document.getElementById('result-view').style.display = 'block';
});
function goToBajet() {
  let gajiBersih = window.gajiBersihToTransfer || 0;
  window.open("https://pwntable.github.io/kalkulator-bajet/?gaji="+encodeURIComponent(gajiBersih.toFixed(2)),"_blank");
}
function showFormAgain(){
    document.getElementById('result-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
    document.getElementById('gajiBasic').value = lastInput.gajiBasic;
    document.getElementById('ot15').value = lastInput.ot15;
    document.getElementById('ot2').value  = lastInput.ot2;
    document.getElementById('ot3').value  = lastInput.ot3;
    document.getElementById('nightRate').value = lastInput.nightRate;
    document.getElementById('nightDay').value  = lastInput.nightDay;
    document.getElementById('gajiBasic').focus();
    let otAny = lastInput.ot15 || lastInput.ot2 || lastInput.ot3;
    if(otAny){ otSection.style.display="block"; otYes.classList.add('active'); otNo.classList.remove('active'); }
    else{ otSection.style.display="none"; otNo.classList.add('active'); otYes.classList.remove('active'); }
    let nightAny = lastInput.nightRate || lastInput.nightDay;
    if(nightAny){ nightSection.style.display="block"; nightYes.classList.add('active'); nightNo.classList.remove('active'); }
    else{ nightSection.style.display="none"; nightNo.classList.add('active'); nightYes.classList.remove('active'); }
}
function doPrint() {
  let output = document.querySelector('.output').cloneNode(true);
  let btns = output.querySelectorAll('button');
  btns.forEach(btn => btn.remove());
  let myWindow = window.open('', '', 'width=500,height=600');
  myWindow.document.write(`
    <html><head><title>Cetak Gaji Bulanan</title>
    <style>
    body{font-family:Arial,sans-serif;}
    .output{max-width:390px;margin:40px auto;padding:22px 20px 18px 20px;background:#fff;border-radius:14px;box-shadow:0 2px 8px #6fcaca08;}
    .output-title{font-size:1.18em;font-weight:600;margin-bottom:14px;}
    .rowx{display:flex;justify-content:space-between;margin: 2.5px 0;}
    .rowx.bold{font-weight:600;}
    .summary{font-weight:600;margin:11px 0 3px 0;}
    </style>
    </head><body>${output.outerHTML}</body></html>
  `);
  myWindow.document.close();
  myWindow.focus();
  myWindow.print();
  setTimeout(() => myWindow.close(), 500);
}
function resetForm() {
  document.getElementById('formGaji').reset();
  lastInput = { gajiBasic:'', ot15:'', ot2:'', ot3:'', nightRate:'', nightDay:'' };
  document.getElementById('basicError').textContent = '';
  document.getElementById('nightRateError').textContent = '';
  document.getElementById('nightDayError').textContent = '';
  otSection.style.display="none"; otNo.classList.add('active'); otYes.classList.remove('active');
  nightSection.style.display="none"; nightNo.classList.add('active'); nightYes.classList.remove('active');
}