module.exports = (srv) => {

  const { Books } = cds.entities('my.bookshop');

  srv.before('CREATE', 'Orders', async (req) => {
    const order = req.data;
    if (!order.amount || order.amount <= 0) return req.error(400, 'Order at least 1 book');
    const tx = cds.transactions(req);
    const affectedRows = await tx.run(
      UPDATE(Books)
        .set({ stock: { '-=': order.amount } })
        .where({ stock: { '>=': order.amount},/*and*/ ID:order.book_ID })
    )
    if(affectedRows === 0) req.error (409, "Sold Out or Out of Stock")

  });

  srv.after ('READ', 'Books', each=>{
    if (each.stock > 100) each.title += ' -- 10% discount!'
  })








  /*  srv.on("READ", "Books", () => [
      { ID: 101, title: "The Immortals of Meluha", author_ID: 301, stock: 100 },
      { ID: 102, title: "Rich Dad Poor Dad", author_ID: 302, stock: 100 },
      { ID: 103, title: "PS", author_ID: 301, stock: 203 },
    ])
  
    srv.on("READ", "Authors", () => [
      { ID: 301, name: "Amish" },
      { ID: 302, name: "Robert K." },
      { ID: 303, name: "Mr. ABC" },
    ])*/
};

