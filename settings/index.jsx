function settings(props) {
  return (
    <Page>
      <Section
        title={<Text bold>{props.settingsStorage.getItem("t_favourite_stops")}</Text>}>
        <Text>{props.settingsStorage.getItem("t_favourite_stops_description")}</Text>
        <TextInput
          title={props.settingsStorage.getItem("t_first_favourite_stop")}
          label={props.settingsStorage.getItem("t_first_favourite_stop")}
          placeholder={props.settingsStorage.getItem("t_search_for_stops")}
          action={props.settingsStorage.getItem("t_add_stop")}
          value={(() => { try{ return JSON.parse(props.settingsStorage.getItem("favourite_1"))}catch(e){ }})()}
          onChange={value => props.settingsStorage.setItem('favourite_1', JSON.stringify(value))}
          onAutocomplete={(value) => {
            const autoValues = [];
            
            props.settingsStorage.setItem('searchStations', value.trim());
            
            autoValues = props.settingsStorage.getItem('resultStations');
            
            return JSON.parse(autoValues);
          }}
        />
        <TextInput
          title={props.settingsStorage.getItem("t_second_favourite_stop")}
          label={props.settingsStorage.getItem("t_second_favourite_stop")}
          placeholder={props.settingsStorage.getItem("t_search_for_stops")}
          action={props.settingsStorage.getItem("t_add_stop")}
          value={(() => { try{ return JSON.parse(props.settingsStorage.getItem("favourite_2"))}catch(e){}})()}
          onChange={value => props.settingsStorage.setItem('favourite_2', JSON.stringify(value))}
          onAutocomplete={(value) => {
            const autoValues = [];
            
            props.settingsStorage.setItem('searchStations', value.trim());
            
            autoValues = props.settingsStorage.getItem('resultStations');
            
            return JSON.parse(autoValues);
          }}
        />
      </Section>
      <Section
        title={<Text bold>{props.settingsStorage.getItem("t_other_settings")}</Text>}>
        <Toggle
          label={props.settingsStorage.getItem("t_show_minutes_first")}
          settingsKey="minutesFirst"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settings);