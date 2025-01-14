import raveIcon from '../../images/Rave.svg';
import rantIcon from '../../images/Rant.svg';

export const Rave = () => {
  const isRave = Math.round(Math.random()) === 1;
  const iconPath = isRave ? raveIcon : rantIcon;

  return (
    <div className="rave-rant d-flex gap-2">
      <img
        src={iconPath}
        alt={isRave ? 'Rave' : 'Rant'}
        style={{ width: '16px' }}
      />
      <span>{isRave ? "Raved" : "Ranted"}</span>
    </div>
  );
};