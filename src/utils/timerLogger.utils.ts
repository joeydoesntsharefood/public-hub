import { _module } from 'src/types/modules.type';

const timerLogger = ({
  infos,
  modules,
}: {
  modules: _module;
  infos: string;
}) => {
  console.log(`[${modules}] ${new Date().toLocaleString()} ${infos}`);
};

export { timerLogger };
