type ConProps = {
  id: string;
  className?: string;
  dataSettings?: Record<string, unknown>;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function settingsAttr(settings?: Record<string, unknown>) {
  if (!settings) return undefined;
  return JSON.stringify(settings);
}

/** Theme CSS hooks — same DOM as the Elementor export; edit section components, not page factories. */
export function ElementorParent({ id, className = "", dataSettings, children }: ConProps) {
  return (
    <div
      className={`elementor-element elementor-element-${id} e-con e-parent ${className}`.trim()}
      data-id={id}
      data-element_type="container"
      data-e-type="container"
      data-settings={settingsAttr(dataSettings)}
    >
      {children}
    </div>
  );
}

export function ElementorChild({ id, className = "", dataSettings, style, children }: ConProps) {
  return (
    <div
      className={`elementor-element elementor-element-${id} e-con e-child ${className}`.trim()}
      data-id={id}
      data-element_type="container"
      data-e-type="container"
      data-settings={settingsAttr(dataSettings)}
      style={style}
    >
      {children}
    </div>
  );
}

export function ElementorInner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`e-con-inner w-full bg-transparent ${className}`.trim()}>{children}</div>;
}

export function ElementorWidget({
  id,
  widgetType,
  className = "",
  dataSettings,
  bareContainer = false,
  children,
}: {
  id: string;
  widgetType: string;
  className?: string;
  dataSettings?: Record<string, unknown>;
  bareContainer?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`elementor-element elementor-element-${id} elementor-widget elementor-widget-${widgetType} ${className}`.trim()}
      data-id={id}
      data-element_type="widget"
      data-e-type="widget"
      data-widget_type={`${widgetType}.default`}
      data-settings={settingsAttr(dataSettings)}
    >
      {bareContainer ? (
        children
      ) : (
        <div className="elementor-widget-container">{children}</div>
      )}
    </div>
  );
}
