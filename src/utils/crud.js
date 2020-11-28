import { getIdFromCookie } from './auth'

/// if empty or package express validator

export const createOne = model => async (req, res) => {
  const createdBy = await getIdFromCookie(req.cookies.token)
  const name = req.body.name
  try {
    if (name !== '') {
      const doc = await model.create({ name, createdBy })
      res.status(200).send({ createdId: doc._id })
    }
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: await getIdFromCookie(req.cookies.token),
          _id: req.body.id
        },
        req.body.toChange,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      createdBy: await getIdFromCookie(req.cookies.token),
      _id: req.body.id
    })

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  createOne: createOne(model)
})
