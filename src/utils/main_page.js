import { Item } from '../resources/item/item.model'

export const renderMyPage = async (req, res) => {
  const activeTasksArr = await Item.find({
    createdBy: req.user._id,
    status: 'active'
  })
    .lean()
    .exec()

  const completedTasksArr = await Item.find({
    createdBy: req.user._id,
    status: 'complete'
  })
    .lean()
    .exec()

  try {
    res.status(200).render('mytodolistpage', {
      activeTasks: activeTasksArr,
      completedTasks: completedTasksArr
    })
    // res.send({ data: completedTasks, user: req.user._id})
  } catch (e) {
    return res.status(400).render('todolist', { error: e })
  }
}
