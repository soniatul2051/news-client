import { useTranslation } from "react-i18next";
import DetailsVideoCard from "../DetailsPage/VideoCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../API";
import SubNewsCard from "../ItemPage/SubNewsCard";


function SubCardSection() {
    const { t } = useTranslation();
    const [subCardsData,setsubCardsData] = useState()
    useEffect(()=>{
        fetchsubCardsData()
    },[])

    async function fetchsubCardsData() {
        const response = await axios.get(`${API_URL}/article?pagenation=true&limit=4&type=img&newsType=topStories&status=online`)
        const data  = response.data
        setsubCardsData(data)
        
    }
    return (
        <>
        
            
        
        {subCardsData &&
            <div className="itempage-main-sub-news-area">
                
                {subCardsData?.map((topStory)=>{
                    return (
                        <SubNewsCard data={topStory}/>
                    )
                })}
            </div>
          }
        </>
    )

}
export default SubCardSection