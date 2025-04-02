ALTER TABLE visits
    ADD CONSTRAINT visits_company_name_enterprises_company_name_fk FOREIGN KEY (company_name) REFERENCES public.enterprises (company_name);

ALTER TABLE enterprises DROP COLUMN dispatching_unit;

ALTER TABLE enterprises DROP COLUMN district;

ALTER TABLE enterprises
    ADD CONSTRAINT enterprises_company_name_unique UNIQUE (company_name);

ALTER TABLE enterprises
    ADD CONSTRAINT comp_name_check CHECK (char_length(enterprises.company_name) BETWEEN 3 AND 50);

ALTER TABLE enterprises
    ADD CONSTRAINT address_check CHECK (char_length(enterprises.address) BETWEEN 2 AND 50);

ALTER TABLE enterprises
    ADD CONSTRAINT legal_person_check CHECK (char_length(enterprises.legal_person_name) BETWEEN 2 AND 10);

ALTER TABLE enterprises
    ADD CONSTRAINT legal_person_phone_check CHECK (enterprises.legal_person_phone ~ '^[0-9]{11}$');

ALTER TABLE enterprises
    ADD CONSTRAINT business_scope_check CHECK ((enterprises.business_scope IS NULL) OR (char_length(enterprises.business_scope) < 300));

ALTER TABLE enterprises
    ADD CONSTRAINT contact_person_check CHECK ((enterprises.contact_person IS NULL) OR (char_length(enterprises.contact_person) BETWEEN 2 AND 6));

ALTER TABLE enterprises
    ADD CONSTRAINT contact_person_phone_check CHECK ((enterprises.contact_person_phone IS NULL) OR (enterprises.contact_person_phone ~ '^[0-9]{11}$'));

ALTER TABLE enterprises
    ADD CONSTRAINT "employeeCount_check" CHECK (enterprises.employee_count >= 1);

ALTER TABLE enterprises
    ADD CONSTRAINT "registeredCapital_check" CHECK (enterprises.registered_capital > 0.0);

ALTER TABLE visits
    ADD CONSTRAINT commissioner_check CHECK (char_length(visits.commissioner) > 2);

ALTER TABLE visits
    ADD CONSTRAINT visited_person_position_check CHECK (char_length(visits.visited_person_position) > 1);

ALTER TABLE visits
    ADD CONSTRAINT visited_person_phone_check CHECK (visits.visited_person_phone ~ '^[0-9]{11}$');

ALTER TABLE visits
    ADD CONSTRAINT company_demand_check CHECK (char_length(visits.company_demand) < 300);
