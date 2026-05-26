import { printer as ThermalPrinter, types } from "node-thermal-printer";

export async function printReceipt(text: string) {
  const printer = new ThermalPrinter({
    type: types.EPSON,
    interface: "printer:POS-80",
  });

  printer.alignCenter();
  printer.println("My Store");
  printer.drawLine();
  printer.println(text);
  printer.drawLine();
  printer.cut();

  await printer.execute();
}