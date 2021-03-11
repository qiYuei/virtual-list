import Mock from 'mockjs'

const Random = Mock.Random

const data = []
for (let i = 0; i < 10000; i++) {
  data.push({ id: i, content: Random.sentence(15, 20) })
}

export default data
