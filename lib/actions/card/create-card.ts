"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/database/mongodb"
import { getUserSession } from "@/lib/actions/auth/get-user-session"
import { ActionState, createValidatedAction } from "@/lib/actions/create-validated-action"
import List from "@/lib/database/models/list.model"
import Card from "@/lib/database/models/card.model"
import { ICard } from "@/lib/database/models/types"
import { CreateCardValidation } from "@/lib/validations/card"

type CreateCardInput = z.infer<typeof CreateCardValidation>
type CreateCardReturn = ActionState<CreateCardInput, ICard>

export const createCardHandler = async (data: CreateCardInput): Promise<CreateCardReturn> => {
  const { session } = await getUserSession()
  if (!session) { return { error: "Unauthorized" } }

  const { title, boardId, listId } = data

  let card

  try {
    await connectDB()

    const list = await List.findById(listId)
    
    if (!list) {
      return { error: "List not found" }
    }
    
    const lastCard = await Card.findOne({ listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = new Card({ title, listId, order: newOrder })
    // console.log({card})

    await card.save()

    await List.findByIdAndUpdate(
      listId,
      { $push: { cards: card._id }
    })

  } catch (error) {
    return { error: "Failed to create" }
  }
  
  const cardObject = card.toObject()
  cardObject._id = cardObject._id.toString()
  cardObject.listId = cardObject.listId.toString()

  revalidatePath(`/board/${boardId}`)
  return { data: cardObject }
}

export const createCard = createValidatedAction(CreateCardValidation, createCardHandler)