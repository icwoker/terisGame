import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface IViewer {
  /**
   * 显示
   */
  show(): void;

  /**
   * 移除，不再显示
   */
  remove(): void;
}

/**
 * 形状
 */
export type Shape = Point[];

export enum MoveDirection {
  left,
  right,
  down,
}

export enum GameStatus {
  init,
  playing,
  pause,
  over,
}

export interface GameViewer {
  /**
   *
   * @param teris 下个方块对象
   */
  showNext(teris: SquareGroup): void;
  /**
   *
   * @param teris 切换的方块对象
   */
  switch(teris: SquareGroup): void;

  /**
   *完成界面的初始化
   */
  init(game: Game): void;
  showScore(score: number): void;

  onGamePause(): void;
  onGameStart(): void;
  onGameOver(): void;
}
