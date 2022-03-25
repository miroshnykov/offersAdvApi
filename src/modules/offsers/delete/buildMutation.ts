export default (id: number) => `mutation delOffer {
  delOffer(id: ${id}) {
    id
  }
}`;
