export const getDeviceIcon = ({
  icon,
  deviceClass,
}: {
  icon?: string;
  deviceClass?: string;
}) => {
  if (icon) {
    return icon;
  }
  switch (deviceClass) {
    case "speaker":
      return "mdi:speaker";
    case "receiver":
      return "mdi:audio-video";
    default:
      return "mdi:speaker";
  }
};
