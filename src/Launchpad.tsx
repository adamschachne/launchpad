import React from "react";
import { makeStyles } from "@material-ui/styles";
// 8x8 grid

const useStyles = makeStyles({
  root: {
    display: "grid",
    minWidth: 400,
    minHeight: 400,
    margin: 10,
    gridGap: 10,
    gridTemplateColumns: "repeat(8, 100px)"
  },
  button: {
    backgroundColor: "#AAAAAA",
    borderRadius: 5,
    padding: 20,
    fontSize: 30,
    textAlign: "center",
    userSelect: "none"
  }
});

type Props = {
  click: (r: number, c: number) => void;
};

function iToRC(i: number): [number, number] {
  return [Math.floor(i / 8), i % 8];
}

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
const Launchpad = ({ click }: Props) => {
  const { root, button } = useStyles();
  return (
    <div className={root}>
      {Array.from(new Array(64).keys()).map((id) => (
        <div role="button" onClick={() => click(...iToRC(id))} key={id} className={button}>
          {id}
        </div>
      ))}
    </div>
  );
};

export default Launchpad;
