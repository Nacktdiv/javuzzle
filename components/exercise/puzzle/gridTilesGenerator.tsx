import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { TilesType } from "../../material/dataMateri";

interface GridTilesGeneratorProps {
  data: TilesType[];
  chooseComponent: TilesType[];
  setChooseComponent: React.Dispatch<React.SetStateAction<TilesType[]>>;
}

export default function GridTilesGenerator({
  data,
  chooseComponent,
  setChooseComponent,
}: GridTilesGeneratorProps) {
  function RenderItemGrid({ item }: { item: TilesType }) {
    const sudahDipilih = chooseComponent.includes(item);
    function handleClickTiles() {
      if (sudahDipilih) {
        setChooseComponent((prev) => prev.filter((items) => items !== item));
      } else {
        setChooseComponent((prev) => [...prev, item]);
      }
    }
    return (
      <TouchableOpacity
        onPress={() => handleClickTiles()}
        style={[
          styles.ItemContainer,
          sudahDipilih
            ? styles.ItemContainerActive
            : styles.ItemContainerDisable,
        ]}
      >
        <Image style={styles.ItemContainerImage} source={item.image} />
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      style={styles.FlatListStyle}
      contentContainerStyle={styles.FlatListCCStyle}
      columnWrapperStyle={styles.FlatListCWStyle}
      numColumns={3}
      data={data}
      renderItem={RenderItemGrid}
    />
  );
}

const styles = StyleSheet.create({
  FlatListStyle: {
    width: "100%",
    height: "100%",
  },
  FlatListCCStyle: {
    borderWidth: 5,
    borderColor: "#6f411d",
    padding: 5,
    gap: 5,
  },
  FlatListCWStyle: {
    gap: 5,
  },
  ItemContainer: {
    flex: 1,
    aspectRatio: "1/1",
    overflow: "hidden",
    borderRadius: 5,
    borderWidth: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  ItemContainerActive: {
    opacity: 1,
    borderColor: "#6f411d",
  },
  ItemContainerDisable: {
    opacity: 0.75,
    borderColor: "#FFECC8",
  },
  ItemContainerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
