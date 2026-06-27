import {
    ComponentType,
    komponenAksara,
    TilesType,
} from "../../material/dataMateri";

export default function RandomTilesGenerator(data: ComponentType[]) {
  // partial fisher yates
  const dataMapping = data.map((item) => ({
    nama: item.nama,
    image: item.image,
  }));
  const pilihanSalah = 9 - data.length;
  let opsiPilihan = komponenAksara.filter((item) => {
    return !dataMapping.some((itemData) => itemData.nama === item.nama);
  });
  for (let i = 0; i < pilihanSalah; i++) {
    const indexTarget = opsiPilihan.length - 1 - i;
    const indexRandom = Math.floor(Math.random() * (indexTarget + 1));
    [opsiPilihan[indexTarget], opsiPilihan[indexRandom]] = [
      opsiPilihan[indexRandom],
      opsiPilihan[indexTarget],
    ];
  }
  opsiPilihan = opsiPilihan.slice(opsiPilihan.length - pilihanSalah);
  const filtered: TilesType[] = [...opsiPilihan, ...dataMapping];

  // fisher yates
  for (let i = 0; i < 9; i++) {
    const indexTarget = filtered.length - 1 - i;
    const indexRandom = Math.floor(Math.random() * (indexTarget + 1));
    [filtered[indexTarget], filtered[indexRandom]] = [
      filtered[indexRandom],
      filtered[indexTarget],
    ];
  }

  return filtered;
}
