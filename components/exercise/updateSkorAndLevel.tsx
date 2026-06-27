
import { supabase } from "@/config/supabase.web";
import { globalDataContext } from "@/app/_layout";

type userType = {
  id : string,
  email : string,
  nama : string,
  level : number,
  poin : number,
  study_plan : number,
  created_at : string
}

type UpdateType = {
    user : userType | null,
    setUser : React.Dispatch<React.SetStateAction<userType | null>>;
    poin : number,
    level : number
}

export default async function UpdateSkorAndLevel ({user, setUser, poin, level} : UpdateType) {

    try {
        if (!user) throw new Error('data \'user\' is not provided') 

        const skorBaru = user?.poin + poin

        const { data, error } = await supabase
            .from('users')
            .update({
                level : level, 
                poin : skorBaru
            })
            .eq('id', user?.id)
            .select()
            .single()
        
        if (error) throw new Error('Cannot update skor and level: ' + error.message)

        if (data) {
            setUser(data); 
        }

        return(true)
    } catch (err) {
        throw new Error('Fail during update skor and level: ' + err)
    }
}