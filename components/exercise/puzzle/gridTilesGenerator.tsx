import { Colors } from "@/config/colors";
import { TilesType } from "@/service/global/dataMateri";
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface GridTilesGeneratorProps {
  data: TilesType[];
  chooseComponent: TilesType[];
  setChooseComponent: React.Dispatch<React.SetStateAction<TilesType[]>>;
  maxSlots?: number;
}

export default function GridTilesGenerator({
  data,
  chooseComponent,
  setChooseComponent,
  maxSlots = 4,
}: GridTilesGeneratorProps) {
  function RenderItemGrid({ item }: { item: TilesType }) {
    const sudahDipilih = chooseComponent.includes(item);

    function handleClickTiles() {
      if (sudahDipilih) {
        setChooseComponent((prev) => prev.filter((items) => items !== item));
      } else {
        if (chooseComponent.length < maxSlots) {
          setChooseComponent((prev) => [...prev, item]);
        }
      }
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleClickTiles}
        style={[
          styles.ItemContainer,
          sudahDipilih
            ? styles.ItemContainerActive
            : styles.ItemContainerNormal,
        ]}
      >
        <Image style={styles.ItemContainerImage} source={item.image} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={styles.FlatListCCStyle}
        columnWrapperStyle={styles.FlatListCWStyle}
        numColumns={3}
        data={data}
        renderItem={RenderItemGrid}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  FlatListCCStyle: {
    gap: 12,
  },
  FlatListCWStyle: {
    gap: 12,
    justifyContent: "center",
  },
  ItemContainer: {
    width: 95,
    height: 95,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ItemContainerNormal: {
    borderWidth: 1.5,
    borderColor: "#EFE2CE",
  },
  ItemContainerActive: {
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: "#FFFDF9",
  },
  ItemContainerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
