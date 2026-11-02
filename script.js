// -------------------------------------
// HAFIZA (LOCALSTORAGE) YÖNETİMİ
// -------------------------------------
let maksimumDevamsizlik = localStorage.getItem('maksDevamsizlik') || null;
let devamsizlikKayitlari = JSON.parse(localStorage.getItem('devamsizliklar')) || {};
const okulGunleri = []; // Sadece iş günlerini timestamp (zaman damgası) olarak tutarız

// -------------------------------------
// KAYDIRMA VE MENÜ MANTIĞI
// -------------------------------------
const kaydirmaAlani = document.getElementById('scroll-alani');
const btnDevamsizlik = document.getElementById('btn-devamsizlik');
const btnTakvim = document.getElementById('btn-takvim');
const btnBuguneGit = document.getElementById('bugune-git-btn');
const navArkaPlan = document.getElementById('nav-arka-plan');

function guncelleNavigasyonSlider(aktifButon) {
  navArkaPlan.style.width = aktifButon.offsetWidth + 'px';
  navArkaPlan.style.height = aktifButon.offsetHeight + 'px';
  navArkaPlan.style.transform = `translate(${aktifButon.offsetLeft}px, ${aktifButon.offsetTop}px)`;
}

window.addEventListener('load', () => {
  guncelleNavigasyonSlider(btnDevamsizlik);
  // Sınır belirlenmemişse otomatik sor
  if (!maksimumDevamsizlik) setTimeout(maksDevamsizlikAyarla, 1000); 
});

window.addEventListener('resize', () => {
  const aktifButon = kaydirmaAlani.scrollLeft > window.innerWidth / 2 ? btnTakvim : btnDevamsizlik;
  guncelleNavigasyonSlider(aktifButon);
});

function sayfayaGit(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

let guncelSekme = 'devamsizlik';
kaydirmaAlani.addEventListener('scroll', () => {
  if (kaydirmaAlani.scrollLeft > window.innerWidth / 2) {
    if (guncelSekme !== 'takvim') {
      guncelSekme = 'takvim';
      btnTakvim.classList.add('aktif'); btnDevamsizlik.classList.remove('aktif');
      btnBuguneGit.classList.add('buton-aktif'); guncelleNavigasyonSlider(btnTakvim);
    }
  } else {
    if (guncelSekme !== 'devamsizlik') {
      guncelSekme = 'devamsizlik';
      btnDevamsizlik.classList.add('aktif'); btnTakvim.classList.remove('aktif');
      btnBuguneGit.classList.remove('buton-aktif'); guncelleNavigasyonSlider(btnDevamsizlik);
    }
  }
});

// -------------------------------------
// TAKVİM OLUŞTURMA MANTIĞI
// -------------------------------------
const takvimAlani = document.getElementById('takvim-alani'); 
const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const gunIsimleri = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

let guncelYil = 2026; let guncelAy = 8; 
const bitisYili = 2027; const bitisAyi = 5; 

const gercekBugun = new Date();
const gercekBugunYil = gercekBugun.getFullYear();
const gercekBugunAy = gercekBugun.getMonth();
const gercekBugunGun = gercekBugun.getDate();
const bugunZaman = new Date(gercekBugunYil, gercekBugunAy, gercekBugunGun).getTime(); // Gece yarısı

const tatiller = new Set([
  "2026-9-29", "2027-0-1", "2027-3-23", "2027-4-1", 
  "2027-4-15", "2027-4-17", "2027-4-18", "2027-4-19"
]);

for (let d = 16; d <= 20; d++) tatiller.add(`2026-10-${d}`);
for (let d = 25; d <= 31; d++) tatiller.add(`2027-0-${d}`);
for (let d = 1; d <= 5; d++) tatiller.add(`2027-1-${d}`);
for (let d = 8; d <= 12; d++) tatiller.add(`2027-2-${d}`);

while (guncelYil < bitisYili || (guncelYil === bitisYili && guncelAy <= bitisAyi)) {
  const ayKutusu = document.createElement('div');
  ayKutusu.className = 'ay-kutusu';
  const baslik = document.createElement('h3');
  baslik.className = 'ay-baslik'; baslik.innerText = `${aylar[guncelAy]} ${guncelYil}`;
  ayKutusu.appendChild(baslik);

  const gunlerBaslik = document.createElement('div');
  gunlerBaslik.className = 'gunler-baslik';
  gunIsimleri.forEach(g => {
    const el = document.createElement('div'); el.innerText = g; gunlerBaslik.appendChild(el);
  });
  ayKutusu.appendChild(gunlerBaslik);

  const grid = document.createElement('div');
  grid.className = 'takvim-grid';

  const ilkGunTarihi = new Date(guncelYil, guncelAy, 1);
  let ilkGunHaftaninGunu = ilkGunTarihi.getDay(); 
  ilkGunHaftaninGunu = ilkGunHaftaninGunu === 0 ? 6 : ilkGunHaftaninGunu - 1; 
  const aydakiGunSayisi = new Date(guncelYil, guncelAy + 1, 0).getDate();

  for (let i = 0; i < ilkGunHaftaninGunu; i++) {
    const bos = document.createElement('div'); bos.className = 'bos-gun'; grid.appendChild(bos);
  }

  for (let gun = 1; gun <= aydakiGunSayisi; gun++) {
    const gunKutusu = document.createElement('div');
    gunKutusu.className = 'gun';
    gunKutusu.innerHTML = `<span>${gun}</span>`;

    const haftaninGunu = new Date(guncelYil, guncelAy, gun).getDay();
    const tarihString = `${guncelYil}-${guncelAy}-${gun}`;
    const gunZaman = new Date(guncelYil, guncelAy, gun).getTime();
    
    gunKutusu.setAttribute('data-tarih', tarihString);

    const haftaSonuMu = (haftaninGunu === 0 || haftaninGunu === 6);
    const tatilGunuMu = tatiller.has(tarihString);
    const okulAcilisOncesiMi = (guncelYil === 2026 && guncelAy === 8 && gun < 7);
    const yazTatiliMi = (guncelYil === 2027 && guncelAy === 5 && gun > 25);

    if (haftaSonuMu || tatilGunuMu || okulAcilisOncesiMi || yazTatiliMi) {
      gunKutusu.classList.add('okul-yok');
    } else {
      gunKutusu.classList.add('okul-var');
      // Okul günlerini array'e (gelecek hesaplamaları için) ekle
      okulGunleri.push(gunZaman);
    }

    if (guncelYil === gercekBugunYil && guncelAy === gercekBugunAy && gun === gercekBugunGun) {
      gunKutusu.classList.add('bugun-vurgusu');
      gunKutusu.id = 'takvimdeki-bugun';
    }

    // Varsa devamsızlığı işle
    if (devamsizlikKayitlari[tarihString]) {
      gunKutusu.classList.add(devamsizlikKayitlari[tarihString]);
    }

    grid.appendChild(gunKutusu);
  }

  ayKutusu.appendChild(grid);
  takvimAlani.appendChild(ayKutusu);

  guncelAy++;
  if (guncelAy > 11) { guncelAy = 0; guncelYil++; }
}

btnBuguneGit.addEventListener('click', () => {
  const bugunKutusu = document.getElementById('takvimdeki-bugun');
  if (bugunKutusu) bugunKutusu.scrollIntoView({ behavior: 'smooth', block: 'center' });
  else alert("Bugün, bu takvim aralığında yer almıyor.");
});

// -------------------------------------
// İSTATİSTİK VE YENİ PLANLAMA MANTIĞI
// -------------------------------------
function maksDevamsizlikAyarla() {
  const cevap = prompt("Okulunuzda kalma sınırı olan maksimum devamsızlık hakkınız kaç gün? (Örn: 30)");
  if (cevap !== null && !isNaN(cevap) && cevap.trim() !== "") {
    maksimumDevamsizlik = parseFloat(cevap);
    localStorage.setItem('maksDevamsizlik', maksimumDevamsizlik);
    istatistikleriGuncelle();
  }
}

function istatistikleriGuncelle() {
  let kullanilanGun = 0;
  for (let tarih in devamsizlikKayitlari) {
    if (devamsizlikKayitlari[tarih] === 'tam-gun') kullanilanGun += 1;
    else if (devamsizlikKayitlari[tarih] === 'yarim-gun') kullanilanGun += 0.5;
  }

  document.getElementById('kullanilan-gun').innerText = kullanilanGun;
  const maksKutu = document.getElementById('maks-gun');
  const kalanKutu = document.getElementById('kalan-gun');
  
  if (maksimumDevamsizlik !== null) {
    maksKutu.innerText = maksimumDevamsizlik;
    const kalan = maksimumDevamsizlik - kullanilanGun;
    kalanKutu.innerText = kalan;
    kalanKutu.style.color = kalan <= 0 ? "#ef4444" : "#111827";
  }
  
  planiGoster(); // İstatistikler güncellenince plan arayüzünü de yenile
}

function planiYenile() {
  if (!maksimumDevamsizlik) {
    alert("Lütfen önce yukarıdaki 'Sınır' kutusuna tıklayarak maksimum hakkınızı belirleyin.");
    return;
  }
  
  let kullanilan = 0;
  for (let t in devamsizlikKayitlari) {
    if(devamsizlikKayitlari[t] === 'tam-gun') kullanilan += 1;
    if(devamsizlikKayitlari[t] === 'yarim-gun') kullanilan += 0.5;
  }
  const kalan = maksimumDevamsizlik - kullanilan;

  if (kalan <= 0) {
    alert("Kullanılabilecek devamsızlık hakkınız kalmamış.");
    return;
  }

  const kalanOkulGunleri = okulGunleri.filter(z => z >= bugunZaman);

  if (kalanOkulGunleri.length === 0) {
    alert("Okul yılı bitmiş veya kalan iş günü yok!");
    return;
  }

  let aralik = Math.floor(kalanOkulGunleri.length / kalan);

  localStorage.setItem('planBaslangic', bugunZaman);
  localStorage.setItem('planAralik', aralik);

  istatistikleriGuncelle();
}

function planiGoster() {
  const planBaslangic = parseInt(localStorage.getItem('planBaslangic'));
  const planAralik = parseInt(localStorage.getItem('planAralik'));
  
  const planDurum = document.getElementById('plan-durum');
  const planDetay = document.getElementById('plan-detay');
  const planProgress = document.getElementById('plan-progress');

  let kullanilan = 0;
  for (let t in devamsizlikKayitlari) {
    if(devamsizlikKayitlari[t] === 'tam-gun') kullanilan += 1;
    if(devamsizlikKayitlari[t] === 'yarim-gun') kullanilan += 0.5;
  }
  const kalanHak = (maksimumDevamsizlik || 0) - kullanilan;

  // 1. Durum: Haklar Tamamen Bitti
  if (kalanHak <= 0 && maksimumDevamsizlik !== null) {
    planDurum.innerText = "⚠️ Haklarınız Tükendi";
    planDurum.style.color = "#ef4444";
    planDetay.innerText = "Planlama yapılamıyor çünkü hakkınız kalmadı.";
    planProgress.style.width = "100%";
    planProgress.style.backgroundColor = "#ef4444";
    return;
  }

  // 2. Durum: Henüz Plan Yapılmadı
  if (!planBaslangic || isNaN(planAralik)) {
    planDurum.innerText = "Plan oluşturulmadı.";
    planDurum.style.color = "#4b5563";
    planDetay.innerText = "Kalan günlerinizi dengeli dağıtmak için Yenile butonuna basın.";
    planProgress.style.width = "0%";
    return;
  }

  // 3. Durum: Okul Gününden Daha Fazla Hak Var
  if (planAralik === 0) {
    planDurum.innerText = "Devamsızlık hakkınız bol! 🎉";
    planDurum.style.color = "#10b981";
    planDetay.innerText = "Kalan okul gününden daha fazla hakkınız var. İstediğiniz gün kullanabilirsiniz.";
    planProgress.style.width = "100%";
    planProgress.style.backgroundColor = "#10b981";
    return;
  }

  // 4. Durum: Normal Plan İşliyor
  const gecenOkulGunleri = okulGunleri.filter(z => z >= planBaslangic && z < bugunZaman).length;
  const kalanGerekenGun = planAralik - (gecenOkulGunleri % planAralik);
  
  planDurum.innerText = `Her ${planAralik} okul gününde 1 Hak`;
  planDurum.style.color = "#111827";

  if (kalanGerekenGun === planAralik && gecenOkulGunleri > 0) {
    // Hak gelmiş ve bugün kullanabilir
    planDetay.innerHTML = `🎉 <strong>Devamsızlık yapabilirsiniz!</strong> Bekleme döngüsü tamamlandı.<br><span style="color:#10b981; font-weight:700; font-size:0.95rem; display:inline-block; margin-top:6px;">Sıradaki Hak: Bugün</span>`;
    planProgress.style.width = "100%";
    planProgress.style.backgroundColor = "#10b981";
  } else {
    // Gelecekteki hedef tarihi bulma
    const gelecekOkulGunleri = okulGunleri.filter(z => z > bugunZaman);
    let hedefTarihMetni = "Yıl Sonu";
    
    if (kalanGerekenGun <= gelecekOkulGunleri.length && kalanGerekenGun > 0) {
      const hedefZaman = gelecekOkulGunleri[kalanGerekenGun - 1];
      const hD = new Date(hedefZaman);
      const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
      const gunAdlari = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
      
      hedefTarihMetni = `${hD.getDate()} ${ayIsimleri[hD.getMonth()]} ${gunAdlari[hD.getDay()]}`;
    }

    planDetay.innerHTML = `Planlanan bir sonraki hakka: <strong>${kalanGerekenGun} okul günü</strong> kaldı.<br><span style="color:#3b82f6; font-weight:700; font-size:0.95rem; display:inline-block; margin-top:6px;">📅 Beklenen Tarih: ${hedefTarihMetni}</span>`;
    
    const yuzde = ((planAralik - kalanGerekenGun) / planAralik) * 100;
    planProgress.style.width = `${yuzde}%`;
    planProgress.style.backgroundColor = "#3b82f6";
  }
}

// -------------------------------------
// DEVAMSIZLIK MODAL VE KAYIT MANTIĞI
// -------------------------------------
const devModal = document.getElementById('dev-modal');

function modalAc() {
  const tarihInput = document.getElementById('dev-tarih');
  if(!tarihInput.value) {
    const y = gercekBugunYil;
    const m = String(gercekBugunAy + 1).padStart(2, '0');
    const d = String(gercekBugunGun).padStart(2, '0');
    tarihInput.value = `${y}-${m}-${d}`;
  }
  devModal.classList.add('aktif');
}

function modalKapat() { devModal.classList.remove('aktif'); }

function devamsizlikKaydet() {
  const secilenTarih = document.getElementById('dev-tarih').value;
  const tur = document.getElementById('dev-tur').value;

  if (!secilenTarih) { alert("Lütfen bir tarih seçiniz."); return; }

  const [y, m, d] = secilenTarih.split('-');
  const hedefTarihString = `${parseInt(y)}-${parseInt(m) - 1}-${parseInt(d)}`;
  const hedefKutu = document.querySelector(`.gun[data-tarih="${hedefTarihString}"]`);

  if (hedefKutu) {
    hedefKutu.classList.remove('tam-gun', 'yarim-gun', 'gec');
    
    if (tur === 'sil') { delete devamsizlikKayitlari[hedefTarihString]; } 
    else {
      hedefKutu.classList.add(tur);
      devamsizlikKayitlari[hedefTarihString] = tur;
    }
    
    localStorage.setItem('devamsizliklar', JSON.stringify(devamsizlikKayitlari));
    istatistikleriGuncelle();
    modalKapat();
    
    sayfayaGit('takvim-ekrani');
    setTimeout(() => hedefKutu.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
  } else {
    alert("Seçilen tarih okul takviminde bulunamadı.");
  }
}

// -------------------------------------
// PWA SERVICE WORKER KAYDI (ÇEVRİMDIŞI ÇALIŞMA)
// -------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker başarıyla kaydedildi: ', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker kaydı başarısız oldu: ', error);
      });
  });
}
// Sayfa yüklendiğinde ilk hesaplamaları tetikle
istatistikleriGuncelle();
