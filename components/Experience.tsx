import { experience } from "@/lib/data";
import DepthCard from "@/components/ui/depth-card";

export default function Experience() {
  return (
    <div className="experience-list">
      {experience.map((item) => (
        <DepthCard
          className="experience-entry"
          key={`${item.company}-${item.role}`}
          label={`${item.role} at ${item.company}`}
        >
          <div className="experience-heading">
            <div>
              <p className="experience-period mono">{item.period}</p>
              <h3>{item.role}</h3>
              <p className="experience-company">{item.company}</p>
            </div>
            <span className="experience-marker" aria-hidden="true" />
          </div>
          <ul>
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </DepthCard>
      ))}
    </div>
  );
}