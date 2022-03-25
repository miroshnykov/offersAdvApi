export default () => `mutation setHistory(
  $id: Int
  $entity: String
  $user: String
  $action: String
  $logs: String
) {
  setHistory(
    sflId: $id
    entity: $entity
    user: $user
    action: $action
    logs: $logs
  )
}`;
