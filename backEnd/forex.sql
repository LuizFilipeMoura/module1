CREATE TABLE public.clients
(
    id SERIAL,
    name character varying(100),
    wallet_id integer,
    email character varying(100),
    password character varying(100),
    bank_number integer,
    account_number integer,
    birthdate character varying(50),
    forex_account SERIAL,
    CONSTRAINT clients_pkey PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email)
);

CREATE TABLE public.deposits
(
    id  SERIAL,
    client_id integer NOT NULL,
    currency character varying(10) ,
    amount double precision,
    status character varying(10) ,
    date character varying(100) ,
    obs character varying(100),
    CONSTRAINT deposits_pkey PRIMARY KEY (id),
    CONSTRAINT deposits_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public.pasttrades
(
    id  SERIAL,
    from_currency character varying(10) ,
    date character varying(100) ,
    from_amount double precision,
    client_id integer,
    to_currency character varying(10) ,
    to_amount double precision,
    CONSTRAINT pasttrades_pkey PRIMARY KEY (id),
    CONSTRAINT pasttrades_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE public.wallets
(
    id  SERIAL,
    dollaramount double precision,
    poundamount double precision,
    client_id integer NOT NULL,
    euroamount double precision,
    realamount double precision,
    CONSTRAINT wallets_pkey PRIMARY KEY (id),
    CONSTRAINT wallets_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT wallets_client_id_fkey1 FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public.withdraws
(
    id  SERIAL,
    client_id integer,
    currency character varying,
    amount double precision,
    status character varying(10),
    date character varying(100) ,
    obs character varying(100) ,
    CONSTRAINT withdraws_pkey PRIMARY KEY (id),
    CONSTRAINT withdraws_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE FUNCTION public.createwallet()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
		wallet record;
		client record;

BEGIN
	RAISE NOTICE '%', NEW.ID;
	INSERT INTO
        wallets
        VALUES(default, 0, 0, new.id, 0, 0);
	Select * into wallet from wallets 
		where client_id = new.id;
		
		UPDATE clients
			SET wallet_id = wallet.id
			WHERE id = new.id;
		RAISE NOTICE '%', NEW.wallet_id;

		return new;
END
$BODY$;

ALTER FUNCTION public.createwallet()
    OWNER TO postgres;
CREATE FUNCTION public.depositdone()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
declare
   selected_wallet wallets%rowtype;
    BEGIN
		SELECT * into selected_wallet FROM wallets WHERE client_id = OLD.client_id;
        -- Check that empname and salary are given
		IF OLD.status = 'PENDING' THEN
			IF NEW.status = 'DONE' THEN
				IF NEW.currency = 'USD' THEN
					UPDATE wallets SET dollaramount = (selected_wallet.dollaramount::float + new.amount::float) where id = selected_wallet.id;
				END IF;
				IF NEW.currency = 'EUR' THEN
					UPDATE wallets SET euroamount = (selected_wallet.euroamount::float + new.amount::float) where id = selected_wallet.id;
				END IF;
				IF NEW.currency = 'BRL' THEN
					UPDATE wallets SET realamount = (selected_wallet.realamount::float + new.amount::float) where id = selected_wallet.id;
				END IF;
				IF NEW.currency = 'GBP' THEN
					UPDATE wallets SET poundamount = (selected_wallet.poundamount::float + new.amount::float) where id = selected_wallet.id;
				END IF;
			END IF;
		END IF;

        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.depositdone()
    OWNER TO postgres;
CREATE FUNCTION public.directdeposit()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
declare
   selected_wallet wallets%rowtype;
    BEGIN
		SELECT * into selected_wallet FROM wallets WHERE client_id = NEW.client_id;
        -- Check that empname and salary are given
		IF NEW.status = 'DONE' THEN
			IF NEW.currency = 'USD' THEN
				UPDATE wallets SET dollaramount = (selected_wallet.dollaramount::float + new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'EUR' THEN
				UPDATE wallets SET euroamount = (selected_wallet.euroamount::float + new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'BRL' THEN
				UPDATE wallets SET realamount = (selected_wallet.realamount::float + new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'GBP' THEN
				UPDATE wallets SET poundamount = (selected_wallet.poundamount::float + new.amount::float) where id = selected_wallet.id;
			END IF;
		END IF;

        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.directdeposit()
    OWNER TO postgres;
CREATE FUNCTION public.withdrawdone()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
declare
   selected_wallet wallets%rowtype;
    BEGIN
		SELECT * into selected_wallet FROM wallets WHERE client_id = NEW.client_id;
		IF NEW.status = 'DONE' THEN
			IF NEW.currency = 'USD' THEN
				UPDATE wallets SET dollaramount = (selected_wallet.dollaramount::float - new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'EUR' THEN
				UPDATE wallets SET euroamount = (selected_wallet.euroamount::float - new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'BRL' THEN
				UPDATE wallets SET realamount = (selected_wallet.realamount::float - new.amount::float) where id = selected_wallet.id;
			END IF;
			IF NEW.currency = 'GBP' THEN
				UPDATE wallets SET poundamount = (selected_wallet.poundamount::float - new.amount::float) where id = selected_wallet.id;
			END IF;
		END IF;

        RETURN NEW;
    END;
$BODY$;

ALTER FUNCTION public.withdrawdone()
    OWNER TO postgres;



CREATE TRIGGER withdrawdone
    AFTER INSERT
    ON public.withdraws
    FOR EACH ROW
    EXECUTE PROCEDURE public.withdrawdone();


CREATE TRIGGER createwallet
    AFTER INSERT
    ON public.clients
    FOR EACH ROW
    EXECUTE PROCEDURE public.createwallet();

CREATE TRIGGER depositdone
    BEFORE UPDATE 
    ON public.deposits
    FOR EACH ROW
    EXECUTE PROCEDURE public.depositdone();


CREATE TRIGGER directdeposit
    AFTER INSERT
    ON public.deposits
    FOR EACH ROW
    EXECUTE PROCEDURE public.directdeposit();



