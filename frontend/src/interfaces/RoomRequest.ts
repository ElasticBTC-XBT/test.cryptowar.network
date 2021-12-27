interface RoomRequest {
  id: number;
  weaponId: string
  heroId: string
  requester: string
  done: boolean
  roomId: string
  matchReward: number
  totalDeposit: number
}

export default RoomRequest;
