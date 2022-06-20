import "./message.css";
import TimeAgo from "react-timeago";
import turkishString from "react-timeago/lib/language-strings/tr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
export default function Message({ own, message, user, receiver }) {
  const formatter = buildFormatter(turkishString);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className={own ? "message own" : "message"}>
      <div className="message-top">
        <img
          className="message-img"
          src={
            own
              ? user && PF + user.profilePicture
              : receiver && PF + receiver[0].profilePicture
          }
          alt=""
        />
        <p className="message-text">{message.text}</p>
      </div>
      <div className="message-bottom">
        <TimeAgo date={message.createdAt} formatter={formatter} />
      </div>
    </div>
  );
}
