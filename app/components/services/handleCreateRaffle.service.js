export async function handleCreateRaffle(data, push) {
  const createRaffleResult = await createRaffleModel(data);
  if (!createRaffleResult.ok && createRaffleResult.message) {
    if (createRaffleResult.message === "Cliente não encontrado no sistema") {
      return push
        ? () => {
            (clearCupom(), setCupom(data), router.push(push));
          }
        : () => {
            setModalInfo({
              title: "Atenção",
              description:
                "O cpf cadastrado no sistema, diverge do CPF cadastrado no cupom fiscal, favor, confira o CPF presente no cupom fiscal...",
            });
            setOpen(true);
          };
    }
    setModalInfo({
      title: "Atenção",
      description: createRaffleResult.message,
    });
    setOpen(true);
  }
  if (createRaffleResult.ok) {
    clearRaffles();
    setRaffles(createRaffleResult?.raffles);
    return router.push("../sorteios/festival-tv/success");
  }
}
