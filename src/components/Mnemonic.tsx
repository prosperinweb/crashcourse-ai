import type { Mnemonic as MnemonicType } from "../types";

interface MnemonicProps {
  mnemonic: MnemonicType;
}

export const Mnemonic = ({ mnemonic }: MnemonicProps) => (
  <div className="mt-6 bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
    <h5 className="font-bold text-yellow-400">{mnemonic.title}</h5>
    <p className="text-yellow-200">{mnemonic.text}</p>
  </div>
);
