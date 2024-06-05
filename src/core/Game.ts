import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {
  private _gameStatus: GameStatus = GameStatus.init;
  private _curTeris?: SquareGroup;
  private _nextTeris: SquareGroup;
  private _timer?: number;
  private _durtion: number;
  private _exists: Square[] = [];
  private _score: number = 0;

  public get Score() {
    return this._score;
  }

  public set Score(val) {
    this._score = val;
    this._viewer.showScore(val);
    const level = GameConfig.levels.filter((it) => it.score <= val).pop()!;
    if (level.duration === this._durtion) {
      return;
    }
    this._durtion = level.duration;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
      this.autoDrop();
    }
  }

  public get GameStatus() {
    return this._gameStatus;
  }

  private createNext() {
    this._nextTeris = createTeris({ x: 0, y: 0 });
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
    this._viewer.showNext(this._nextTeris);
  }

  constructor(private _viewer: GameViewer) {
    this._nextTeris = createTeris({ x: 0, y: 0 }); //没有实际含义的代码，只是为了让ts不报错
    this._durtion = GameConfig.levels[0].duration;
    this.createNext();
    this._viewer.init(this);
    this._viewer.showScore(this.Score);
  }

  private init() {
    this._exists.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove();
      }
    });
    this._exists = [];
    this.createNext();
    this._curTeris = undefined;
    this.Score = 0;
    this._gameStatus = GameStatus.init;
  }

  start() {
    if (this._gameStatus === GameStatus.playing) {
      return;
    }
    if (this._gameStatus === GameStatus.over) {
      this.init();
    }
    this._gameStatus = GameStatus.playing;
    if (!this._curTeris) {
      this.switchTeris();
    }
    this.autoDrop();
    this._viewer.onGameStart();
  }

  pause() {
    if (this._gameStatus === GameStatus.playing) {
      this._gameStatus = GameStatus.pause;
      clearInterval(this._timer);
      this._timer = undefined;
      this._viewer.onGamePause();
    }
  }

  control_left() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.left, this._exists);
    }
  }

  control_right() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.right, this._exists);
    }
  }

  control_down() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exists);
      this.hitBottom();
    }
  }

  control_rotate() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.rotate(this._curTeris, this._exists);
    }
  }

  private autoDrop() {
    if ((this._timer || this, this._gameStatus !== GameStatus.playing)) {
      return;
    }
    this._timer = setInterval(() => {
      if (this._curTeris) {
        if (!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
          this.hitBottom();
        }
      }
    }, this._durtion);
  }

  private switchTeris() {
    this._curTeris = this._nextTeris;
    this._curTeris.squares.forEach((sq) => {
      if (sq.viewer) {
        sq.viewer.remove();
      }
    });
    this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);
    if (
      !TerisRule.canIMove(
        this._curTeris.shape,
        this._curTeris.centerPoint,
        this._exists
      )
    ) {
      this._gameStatus = GameStatus.over;
      clearInterval(this._timer);
      this._timer = undefined;
      // this._exists = [];
      this._viewer.onGameOver();
      return;
    }
    this.createNext();
    this._viewer.switch(this._curTeris);
  }

  private resetCenterPoint(width: number, teris: SquareGroup) {
    const x = Math.ceil(width / 2) - 1;
    const y = 0;
    teris.centerPoint = { x, y };
    while (teris.squares.some((it) => it.point.y < 0)) {
      teris.centerPoint = {
        x: teris.centerPoint.x,
        y: teris.centerPoint.y + 1,
      };
    }
  }
  private hitBottom() {
    this._exists = this._exists.concat(this._curTeris!.squares);
    const num = TerisRule.deleteSquares(this._exists);
    this.addScore(num);
    this.switchTeris();
  }

  private addScore(lineNum: number) {
    if (lineNum === 0) {
      return;
    } else if (lineNum === 1) {
      this.Score += 10;
    } else if (lineNum === 2) {
      this.Score += 25;
    } else if (lineNum === 3) {
      this.Score += 50;
    } else {
      this.Score += 100;
    }
    // this._viewer.showScore(this._score);
  }
}
