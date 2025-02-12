import React, { createRef, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  loadStatus,
  selectTasks,
  tasksLoaded,
  addProvingTask,
} from "../data/statusSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import initGameInstance from "../js/game";
import History from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";

import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import CurrencyDisplay from "../components/Currency";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import Title from "../images/2048_title.png";
import { eventsTable } from "../data/gameplay";

class State {
    wisdom: number;
    attack: number;
    luck: number;
    charm: number;
    family: number;
    speed: number;
    defence: number;
    age: number;
    currency: number;
    constructor(wisdom: number,
            attack:number,
            luck:number,
            charm:number,
            family:number,
            speed:number,
            defence:number,
            age:number,
            currency:number)
    {
        this.wisdom = wisdom;
        this.attack = attack;
        this.luck = luck;
        this.charm = charm;
        this.family = family;
        this.speed = speed;
        this.defence = defence;
        this.age = age;
        this.currency = currency;
    }
}

export function Main() {
  const dispatch = useAppDispatch();
  const [state, setState] = useState(new State(0,0,0,0,0,0,0,0,0));
  const [submitURI, setSubmitURI] = useState("");

  let ready = useAppSelector(tasksLoaded);

  let updateState = (ins:any) => {
      setState(new State(
         ins.get_wisdom(),
         ins.get_attack(),
         ins.get_luck(),
         ins.get_charm(),
         ins.get_family(),
         ins.get_speed(),
         ins.get_defence(),
         ins.get_age(),
         ins.get_currency(),
      ));
  }

  useEffect(() => {
    initGameInstance().then((ins: any) => {
        ins.init_rg();
        updateState(ins);
    });
  }, []);

  function simulate(acttype: number) {
    initGameInstance().then((ins: any) => {
      console.log("current state", state);
      ins.action();
      let event_id = ins.get_event();
      let event = eventsTable[event_id];
      console.log("event description:", event.description);
      console.log("event choices:", event.choices.length);
      console.log("choose from", event.choices);
      ins.choose(0);
      updateState(ins);
    });
  }

  function restartGame() {
    //reload the window for now
    window.location.reload();
  }

  return (
    <>
      <MainNavBar currency={0} handleRestart={restartGame}></MainNavBar>
      <Container className="justify-content-center mb-4">
        <Row className="mt-3">
          <Col>
            <div className="content">
               <div className="actions">
                  <div onClick={()=>simulate(0)} className="action-working"></div>
                  <div onClick={()=>simulate(1)} className="action-exploring"></div>
                  <div onClick={()=>simulate(2)} className="action-coasting"></div>
               </div>
               <div className="charactor">
               </div>
               <div className="bag">
               </div>
               <div className="map">
               </div>
               <div className="items">
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item"></div>
               </div>
               <div className="historys">
                  <div className="history"></div>
                  <div className="history"></div>
                  <div className="history"></div>
               </div>
               <div className="stickers">
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
                  <div className="sticker"></div>
               </div>
            </div>
          </Col>
        </Row>
      </Container>
      <History md5="77DA9B5A42FABD295FD67CCDBDF2E348"></History>
    </>
  );
}
