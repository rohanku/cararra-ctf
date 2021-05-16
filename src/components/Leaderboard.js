import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { LeaderboardContext } from "../providers/LeaderboardProvider";
import { UserContext } from "../providers/UserProvider";
import { GlobalContext } from "../providers/GlobalProvider";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";
import { round } from "../services/firebase";

// Generate Order Data
function createData(id, rank, name, score, uid) {
  return { id, rank, name, score, uid };
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Leaderboard() {
  const userState = useContext(UserContext);
  let uid = userState.doc.id;
  const data = useContext(GlobalContext).data;
  const map = useContext(LeaderboardContext).users;
  const uids = Object.keys(map);
  const users = [];
  const winners = [];
  uids.forEach((uid) => {
    map[uid].uid = uid;
    users.push(map[uid]);
    winners.push(map[uid]);
  });
  users.sort(function (x, y) {
    if (y.score === x.score && x.solvedChallenges.length > 0) {
      return (
        x.solvedChallenges[x.solvedChallenges.length - 1].timestamp -
        y.solvedChallenges[y.solvedChallenges.length - 1].timestamp
      );
    }
    return y.score - x.score;
  });
  let rows = [];
  //let currScore = 1000000000;
  //let currRank = 0;
  users.forEach((user, index) => {
    /*
    if (user.score < currScore) {
      currRank += 1;
      currScore = user.score;
    }
    replace index+1 with currRank to have same rank with ties
    */
    if (user.score === 0) return;
    rows.push(
      createData(index, index + 1, user.username, user.score, user.uid)
    );
  });
  let winnerrows = [];

  if (data.ended) {
    winners.sort(function (x, y) {
      if (!y.finalScore) {
        if (!x.finalScore) return 0;
        return -1;
      } else if (!x.finalScore) {
        return 1;
      }
      if (y.finalScore === x.finalScore && x.solvedChallenges.length > 0) {
        return (
          x.solvedChallenges[x.finalChallenge].timestamp -
          y.solvedChallenges[y.finalChallenge].timestamp
        );
      }
      return y.finalScore - x.finalScore;
    });

    winners.forEach((user, index) => {
      if (user.finalScore === 0) return;
      winnerrows.push(
        createData(index, index + 1, user.username, user.finalScore, user.uid)
      );
    });
    winnerrows = winnerrows.slice(0, 5);
  }
  const classes = useStyles();
  const leaderboardState = useContext(LeaderboardContext);
  const challengesLoaded = leaderboardState.leaderboardLoaded;
  if (!challengesLoaded) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justify={"center"}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }
  return (
    <React.Fragment>
      {data.ended ? (
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.paper}>
            <React.Fragment>
              <Title>Round {round} Winners</Title>
              <Typography
                color="textSecondary"
                className={classes.depositContext}
              >
                April 27, 2021 to May 15, 2021
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell align="right">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {winnerrows.map((row) => (
                    <TableRow key={row.id} selected={uid === row.uid}>
                      <TableCell>{row.rank}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </React.Fragment>
          </Paper>
        </Container>
      ) : (
        <div />
      )}
      <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>Live Leaderboard</Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} selected={uid === row.uid}>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
