import { SquareGroup } from "../SquareGroup";
import { GameStatus, GameViewer } from "../types";
import $ from "jquery";
import { SquarePageViewer } from "./SquarePageViewer";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
  onGamePause(): void {
    this.msgDom.css({ display: "flex" });
    this.msgDom.find("p").html("游戏暂停");
  }
  onGameStart(): void {
    this.msgDom.hide();
  }
  onGameOver(): void {
    this.msgDom.css({ display: "flex" });
    this.msgDom.find("p").html("游戏结束");
  }
  showScore(score: number): void {
    this.scoreDom.html(score.toString());
  }
  private nextDom = $("#next");
  private panelDom = $("#panel");
  private scoreDom = $("#score");
  private msgDom = $("#msg");
  init(game: Game): void {
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height,
    });
    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
    });

    $(document).on("keydown", (e) => {
      if (e.key === "a") {
        game.control_left();
      } else if (e.key === "w") {
        game.control_rotate();
      } else if (e.key === "d") {
        game.control_right();
      } else if (e.key === "s") {
        game.control_down();
      } else if (e.key === " ") {
        if (game.GameStatus === GameStatus.playing) {
          game.pause();
        } else {
          game.start();
        }
      }
      // console.log(e.key);
    });
  }
  showNext(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      sq.viewer = new SquarePageViewer(sq, this.nextDom);
    });
  }
  switch(teris: SquareGroup): void {
    teris.squares.forEach((sq) => {
      sq.viewer!.remove();
      sq.viewer = new SquarePageViewer(sq, this.panelDom);
    });
  }
}
