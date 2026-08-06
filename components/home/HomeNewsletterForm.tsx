import { EWidget } from "@/components/home/elementor/ElementorCon";

const SUBMIT_ARROW = (
  <>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  </>
);

/** Full-width newsletter (`f12b084` / `db9a700`) — mirror CF7 markup. */
export function HomeNewsletterForm() {
  return (
    <>
      <EWidget id="cc1f6e3" widgetType="heading" bareContainer>
        <h3 className="elementor-heading-title elementor-size-default">
          Subscribe News Updates!
        </h3>
      </EWidget>
      <EWidget
        id="9bc6f93"
        widgetType="fpg-cf7"
        className="elementor-widget__width-initial elementor-widget-mobile__width-inherit"
      >
        <div className="wpcf7 no-js" id="wpcf7-f709-p302-o1" lang="en-US" dir="ltr">
          <form
            action="/#wpcf7-f709-p302-o1"
            method="post"
            className="wpcf7-form init"
            aria-label="Contact form"
            noValidate
          >
            <fieldset className="hidden-fields-container">
              <input type="hidden" name="_wpcf7" value="709" />
              <input type="hidden" name="_wpcf7_version" value="6.1.6" />
              <input type="hidden" name="_wpcf7_locale" value="en_US" />
              <input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f709-p302-o1" />
              <input type="hidden" name="_wpcf7_container_post" value="302" />
              <input type="hidden" name="_wpcf7_posted_data_hash" value="" />
            </fieldset>
            <p>
              <span className="wpcf7-form-control-wrap" data-name="your-email">
                <input
                  size={40}
                  maxLength={400}
                  className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email"
                  autoComplete="email"
                  aria-required="true"
                  placeholder="Enter your email..."
                  type="email"
                  name="your-email"
                />
              </span>
            </p>
            <div className="form-btn-area">
              <p>
                <input
                  className="wpcf7-form-control wpcf7-submit has-spinner"
                  type="submit"
                  value="subscribe"
                />
                <em>
                  <br /> {SUBMIT_ARROW}
                </em>
              </p>
            </div>
            <p>
              <span className="wpcf7-form-control-wrap" data-name="your-consent">
                <span className="wpcf7-form-control wpcf7-acceptance">
                  <span className="wpcf7-list-item">
                    <label>
                      <input type="checkbox" name="your-consent" value="1" />
                      <span className="wpcf7-list-item-label">
                        I have read and agree to the <a href="#"> terms &amp; conditions</a>
                      </span>
                    </label>
                  </span>
                </span>
              </span>
            </p>
            <div className="wpcf7-response-output" aria-hidden="true" />
          </form>
        </div>
      </EWidget>
    </>
  );
}
