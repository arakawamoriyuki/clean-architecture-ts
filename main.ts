// ----- domain -----

// Input Data<DS>
interface ControllerData {
  right: 0 | 1
  left: 0 | 1
  up: 0 | 1
  down: 0 | 1
  a: 0 | 1
  b: 0 | 1
}

// Input Port<I>
abstract class ControllerPort {
  abstract recieveData(data: ControllerData): void
}

// Entity
type Memory = number[]

// Interactor
class GameMachine extends ControllerPort {
  port: HdmiPort;
  storage: MemoryStorage;

  constructor(port: HdmiPort, storage: MemoryStorage) {
    super();
    this.port = port;
    this.storage = storage;
  }

  recieveData(data: ControllerData) {
    console.log('GameMachine#compute');

    const { right, left, up, down, a, b } = data;

    // TODO: 必要であればControllerDataから計算したMemoryをメモリーカードに保存
    const whiteMemory: Memory = [right, left, up, down, a, b];
    this.storage.white(whiteMemory);

    // TODO: 必要であればmemoryを読み取り
    const readMemory: Memory = this.storage.read(10);

    return this.port.sendDisplay(readMemory);
  }
}

// Output Data<DS>
interface OutputSignal {
  signals: number[]
}

// Output Port<I>
abstract class HdmiPort {
  abstract sendDisplay(memory: Memory): void
}

// Data Access<I>
abstract class MemoryStorage {
  abstract white(memory: Memory): void
  abstract read(address: number): Memory
}

// ----- interface -----

// View Model<DS>
interface Pixel {
  red: number
  green: number
  blue: number
}
interface HdmiData {
  pixels: Pixel[][]
}

// View<I>
abstract class Display {
  abstract render(data: HdmiData): void
}

// Controller
class Controller {
  port: ControllerPort;

  constructor(port: ControllerPort) {
    this.port = port;
  }

  controll(aButtonPushed: boolean) { // TODO: bButtonPushed, rightButtonPushed...
    console.log('Controller#controll');

    // TODO: dataを元にInput Data<DS>形式に変換し、Interactorの実装を呼び出す
    const data: ControllerData = {
      right: 0,
      left: 0,
      up: 0,
      down: 0,
      a: aButtonPushed ? 1 : 0,
      b: 0,
    };

    this.port.recieveData(data);
  }
}

// Presenter
class HdmiCable extends HdmiPort {
  display: Display;

  constructor(display: Display) {
    super();
    this.display = display;
  }

  sendDisplay(memory: Memory) {
    console.log('HdmiCable#convert');

    // TODO: メモリから表示するデータを計算
    const data: HdmiData = {
      pixels: [
        [
          { red: 255, green: 0, blue: 0 },
          { red: 0, green: 0, blue: 0 },
          { red: 0, green: 0, blue: 0 },
        ],
        [
          { red: 0, green: 0, blue: 0 },
          { red: 0, green: 255, blue: 0 },
          { red: 0, green: 0, blue: 0 },
        ],
        [
          { red: 0, green: 0, blue: 0 },
          { red: 0, green: 0, blue: 0 },
          { red: 0, green: 0, blue: 255 },
        ],
      ],
    };

    this.display.render(data);
  }
}

// ----- infrastructure -----

// View
class ELDisplay extends Display {
  render(data: HdmiData) {
    console.log('ELDisplay#render');
    // dataを表示
    console.log(data);
  }
}

// DataAccessの実装
class MemoryCard extends MemoryStorage {
  white(memory: Memory) {
    console.log('MemoryCard#white');
    // TODO: memoryの保存処理
  }

  read(address: number): Memory {
    console.log('MemoryCard#read');

    // TODO: addressからメモリの読み出し処理
    return [1, 2, 3, 4, 5, 6];
  }
}

// ----- main -----

const display = new ELDisplay();
const hdmiCable = new HdmiCable(display);
const memoryCard = new MemoryCard();
const gameMachine = new GameMachine(hdmiCable, memoryCard);
const controller = new Controller(gameMachine);

const aButtonPushed = true;
controller.controll(aButtonPushed);

// Controller#controll
// GameMachine#compute
// MemoryCard#white
// MemoryCard#read
// HdmiCable#convert
// ELDisplay#render
