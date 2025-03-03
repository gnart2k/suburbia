"use server"

import axios from "axios"

export default async function MailAction({}){
    try{
        const apiRoute = `${process.env.NEXT_PUBLIC_API_ROUTE}/api/send-mail`
        await axios.post(apiRoute, {

        })


    }catch(e){
        console.log(e)
    }
}