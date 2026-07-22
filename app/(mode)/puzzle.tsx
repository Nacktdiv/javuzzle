import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"

import { Colors } from "@/config/colors";
import { globalDataContext } from "@/app/_layout";
import { ModeContext } from "@/app/(mode)/_layout";
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
    const [answerContainerLength, setAnswerContainerLength] = useState<number>(0)

    // console.log(dataLevel)
    // console.log(gridItems)
    // console.log(chooseComponent)
    // console.log(Object.values(dataLevel[activePart])[0])

    useEffect(() => {
      const generateData = DataPuzzleGenerator(question);
      setDataLevel(generateData);
      setActivePart(0);
    }, [question]);

    useEffect(() => {
      if (!dataLevel) return;

      const progress = (activePart) / dataLevel.length * 100

      setProgress(progress)

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

      if (activePart >= dataLevel.length) {
        if (user?.level != level) {
          showAlert({
            title: "SELAMAT!",
            message: "Anda telah berhasil menyelesaikan tantangan ini, namun poin dan level tidak di update karena anda perna menyelesaikan tantangan ini.",
            confirmText: "OK",
            onConfirmPressed: () => {
              setTimeout(() => {
                router.replace("/(tabs)");
              }, 250);
            },
          });
        } else {
          finalProses()
        }
        return;
      }

      const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;
      const generateRandomGrid = RandomTilesGenerator(komponenSukuKata);
      setGridItems(generateRandomGrid);

      const lengthAnswerContainer : number = (komponenSukuKata.length * (75 + 10)) - 10
      setAnswerContainerLength(lengthAnswerContainer)
    }, [activePart, dataLevel]);

    useEffect(() => {
      if (!dataLevel || !dataLevel[activePart]) return;

      const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;

      if (chooseComponent.length === komponenSukuKata.length) {
        const apakahSemuaBenar = chooseComponent.every(
          (val, index) => val.nama === komponenSukuKata[index].nama
        );
        
        let timer: ReturnType<typeof setTimeout>;
        if (apakahSemuaBenar) {
          timer = setTimeout(() => {
            setChooseComponent([]);
            setActivePart((prev) => prev + 1);
          }, 1000);
        } else {
          timer = setTimeout(() => {
            setChooseComponent([]);
          }, 1000);
        }
      }
    }, [chooseComponent, activePart, dataLevel]);

    return (
        <View style={styles.container}>
        <View style={styles.upContainer}>
            <View style={styles.upQuestionContainer}>
              <TeksHighlight kalimat={question} indexActive={activePart}/>
            </View>
            <View style={styles.upAnswerMainContainer}>
              <View style={[styles.upAnswerChildContainer, {width: answerContainerLength}]} >
                {chooseComponent?.map((item, index) => (
                  <View style={styles.upAnswerItem} key={index}>
                      <Image style={styles.upAnswerItemImage} source={item.image} />
                  </View>
                ))}
              </View>
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
    backgroundColor: Colors.backgroundDark,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },  
  upAnswerMainContainer: {
    flex: 1,
    // width: ,
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upAnswerChildContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.orange,
    gap: 10,
    padding: 10,
    minHeight: 75,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    boxSizing: 'content-box'
    // height: 50,
  },
  upAnswerItem: {
    width: 75,
    boxSizing: 'border-box',
    borderWidth: 4,
    borderColor: Colors.border,
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
    backgroundColor: Colors.border,
    // padding: 10,
    borderRadius: 10
  }
});
