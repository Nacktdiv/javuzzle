import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"

import { globalDataContext } from "../_layout";
import { ModeContext } from "./_layout";
import { useCustomAlert } from "@/components/main/customAlert";
import { ComponentType, TilesType } from "@/components/material/dataMateri";
import TeksHighlight  from "@/components/exercise/textHighlighter";
import DataPuzzleGenerator from "@/components/exercise/puzzle/dataPuzzleGenerator";
import RandomTilesGenerator from "@/components/exercise/puzzle/randomTilesGenerator";
import GridTilesGenerator from "@/components/exercise/puzzle/gridTilesGenerator"
import UpdateSkorAndLevel from "@/components/exercise/updateSkorAndLevel";

export default function PuzzleMode () {
    const router = useRouter()
    const { user, setUser } = useContext(globalDataContext)
    const { setProgress } = useContext(ModeContext)
    const { showAlert } = useCustomAlert()
    const { question, level: levelParam, poin: poinParam } = useLocalSearchParams<{ 
      question: string; 
      level: string; 
      poin: string; 
    }>();
    
    const level = levelParam ? Number(levelParam) : 1;
    const poin = poinParam ? Number(poinParam) : 0;

    const [dataLevel, setDataLevel] = useState<any[] | null>(null);
    const [activePart, setActivePart] = useState<number>(0);
    const [gridItems, setGridItems] = useState<TilesType[]>([]);
    const [chooseComponent, setChooseComponent] = useState<TilesType[]>([]);

    useEffect(() => {
      const generateData = DataPuzzleGenerator(question);
      setDataLevel(generateData);
      setActivePart(0);
    }, [question]);

    useEffect(() => {
      if (!dataLevel) return;

      setProgress((activePart + 1) / dataLevel.length)

      if (activePart >= dataLevel.length) {
        const finalProses = async () => {
          try {
            const data = await UpdateSkorAndLevel({user, setUser, poin, level : level + 1})
  
            if (data) {
              showAlert({
                title: "SELAMAT!",
                message: "Anda telah berhasil menyelesaikan tantangan pada level ini",
                confirmText: "OK",
                onConfirmPressed: () => {
                  setTimeout(() => {
                    router.replace("/(tabs)");
                  }, 250);
                },
              });
            }
          } catch (err) {
            if (!err) return 
            const errorMessage = String(err) 
            showAlert({
              title: "ErrorCanvas",
              message: errorMessage,
              confirmText: "OK",
              onConfirmPressed: () => {
                setTimeout(() => {
                  router.replace("/(tabs)");
                }, 250);
              },
            });
          }
        }
        finalProses()
        return;
      }

      const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;
      const generateRandomGrid = RandomTilesGenerator(komponenSukuKata);
      setGridItems(generateRandomGrid);
    }, [activePart, dataLevel]);

    useEffect(() => {
      if (!dataLevel || !dataLevel[activePart]) return;

      const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;

      if (chooseComponent.length === komponenSukuKata.length) {
        const apakahSemuaBenar = chooseComponent.every(
          (val, index) => val.nama === komponenSukuKata[index].nama
        );

        if (apakahSemuaBenar) {
          setChooseComponent([])
          setActivePart((prev) => prev + 1);
        } else {
         
          setChooseComponent([])
        }
      }
    }, [chooseComponent, activePart, dataLevel]);

    return (
        <View style={styles.container}>
        <View style={styles.upContainer}>
            <View style={styles.upQuestionContainer}>
              <TeksHighlight kalimat={question} indexActive={activePart}/>
            </View>
            <View style={styles.upAnswerContainer}>
              {chooseComponent?.map((item, index) => (
                <View style={styles.upAnswerItem} key={index}>
                    <Image style={styles.upAnswerItemImage} source={item.image} />
                </View>
              ))}
            </View>
        </View>
        <View style={styles.downContainer}>
            {gridItems.length > 0 && (
              <GridTilesGenerator data={gridItems} chooseComponent={chooseComponent} setChooseComponent={setChooseComponent} />
            )}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  upContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  upQuestionContainer: {
    width: '80%',
    backgroundColor: '#cb9163',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },  
  upAnswerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cb9163',
    gap: 10,
    padding: 10,
  },
  upAnswerItem: {
    width: 50,
    borderWidth: 4,
    borderColor: '#6f411d',
    aspectRatio: '1/1',
  }, 
  upAnswerItemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  downContainer: {
    width: "100%",
    aspectRatio: "1/1",
    backgroundColor: "#cb9163",
    padding: 10,
  }
});
