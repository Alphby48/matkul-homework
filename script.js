const toggel = document.querySelector(".peer");
const bodi = document.querySelector("html");
toggel.addEventListener("click", () => {
  bodi.classList.toggle("dark");
});
//
//
document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.querySelector(".input-form");
  const inputMatkul = document.querySelector(".input-matkul");
  const inputKeterangan = document.querySelector(".input-keterangan");
  const inputDeadline = document.querySelector(".input-deadline");
  const inputCheck = document.querySelector(".input-check");
  const inputBtnSub = document.querySelector(".input-btn-sub");
  const inputSelesai = document.querySelector(".input-selesai");
  const inputBelum = document.querySelector(".input-belum");
  const cariData = document.querySelector(".cari-data");
  const btnCariData = document.querySelector(".btn-cari-data");
  const periksaPenyimpanan = localStorage.getItem("MATKUL_JADWAL");

  let saveFile = [];

  if (periksaPenyimpanan) {
    saveFile = JSON.parse(periksaPenyimpanan);
  }

  inputForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const complite = saveFile.some((sF) => sF.Matkul === inputMatkul.value);

    promiseData(complite);
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("butn-belum")) {
      perubahanData(false, e);
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("butn-selesai")) {
      perubahanData(true, e);
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("butn-hapus")) {
      hapusData(e);
    }
  });

  btnCariData.addEventListener("submit", function (e) {
    e.preventDefault();
    const cari = saveFile.filter((sF) =>
      sF.Matkul.toUpperCase().includes(cariData.value.toUpperCase())
    );
    promiseCari(cari);
    showPr(promiseCari);
  });

  function saveStorage() {
    localStorage.setItem("MATKUL_JADWAL", JSON.stringify(saveFile));
  }

  function promiseCari(cari) {
    return new Promise((resolve, reject) => {
      if (cari.length) {
        resolve(panggildataCari(cari));
      } else {
        reject(alert("pencarian anda tidak ada"));
      }
    });
  }

  function showPr(promiseCari) {
    return promiseCari()
      .then((res) => res)
      .catch((res) => res);
  }

  function panggildataCari(cari) {
    const simpanBelum = cari.filter((sF) => sF.Cek === false);
    const simpanSudah = cari.filter((sF) => sF.Cek === true);
    if (simpanBelum) {
      const tambahPage = simpanBelum.map((sF) => addForm(sF));
      inputBelum.innerHTML = tambahPage.join("");
    }
    if (simpanSudah) {
      const tambahPage2 = simpanSudah.map((sF) => addFormSelesai(sF));
      inputSelesai.innerHTML = tambahPage2.join("");
    }
  }

  function perubahanData(nilai, e) {
    const imdbid = e.target.dataset.imdbid;
    const values = saveFile.filter((sv) => sv.Id == imdbid);
    values[0].Cek = nilai;
    panggildata();
  }

  function hapusData(e) {
    const imdbid = e.target.dataset.imdbid;
    const hapusFile = saveFile.findIndex((hf) => hf.Id.toString() === imdbid);
    if (hapusFile !== -1) {
      saveFile.splice(hapusFile, 1);
    }
    panggildata();
  }

  function reset() {
    inputMatkul.value = "";
    inputKeterangan.value = "";
    inputDeadline.value = "";
    inputCheck.checked = false;
  }

  function addData() {
    const data = {
      Id: new Date().getTime(),
      Matkul: inputMatkul.value,
      Keterangan: inputKeterangan.value,
      Deadline: inputDeadline.value,
      Cek: inputCheck.checked,
    };
    saveFile.push(data);

    panggildata();
    reset();
  }

  function promiseData(complite) {
    return new Promise((resolve, reject) => {
      if (!complite) {
        resolve(addData());
      } else {
        reject(alert("data sudah ada"));
      }
    });
  }

  function panggildata() {
    const simpanBelum = saveFile.filter((sF) => sF.Cek === false);
    const simpanSudah = saveFile.filter((sF) => sF.Cek === true);
    if (simpanBelum) {
      const tambahPage = simpanBelum.map((sF) => addForm(sF));
      inputBelum.innerHTML = tambahPage.join("");
    }
    if (simpanSudah) {
      const tambahPage2 = simpanSudah.map((sF) => addFormSelesai(sF));
      inputSelesai.innerHTML = tambahPage2.join("");
    }
    saveStorage();
  }

  function addForm(sF) {
    return `
    <div class="card w-11/12 sm:w-2/5 my-3 bg-stone-100">
      <h5 class="card-header capitalize text-2xl text-blue-600">${sF.Matkul}</h5>
      <div class="card-body min-h-48 relative bg-yellow-50 dark:bg-slate-500">
        <h5 class="card-title text-red-500 dark:text-amber-50">Deadline : ${sF.Deadline}</h5>
        <p class="card-text mb-4 min-h-20 dark:text-neutral-200">
          Ket: ${sF.Keterangan}
        </p>
        <div class="col flex justify-between">
          <btn class="btn btn-primary butn-selesai" data-imdbid="${sF.Id}">Selesai</btn>
          <btn class="btn btn-danger butn-hapus" data-imdbid="${sF.Id}">Hapus</btn>
        </div>
      </div>
    </div>
  `;
  }

  function addFormSelesai(sF) {
    return `
  <div class="card w-11/12 sm:w-2/5 my-3 bg-stone-100">
  <h5 class="card-header capitalize text-2xl text-blue-600">${sF.Matkul}</h5>
  <div class="card-body min-h-48 relative bg-yellow-50 dark:bg-slate-500">
    <h5 class="card-title text-red-500 dark:text-amber-50">Deadline : ${sF.Deadline}</h5>
    <p class="card-text mb-4 min-h-20 dark:text-neutral-200">
      Ket: ${sF.Keterangan}
    </p>
    <div class="col flex justify-between">
      <btn class="btn btn-primary butn-belum" data-imdbid="${sF.Id}">Belum</btn>
      <btn class="btn btn-danger butn-hapus" data-imdbid="${sF.Id}">Hapus</btn>
    </div>
  </div>
</div>
`;
  }

  panggildata();
});
